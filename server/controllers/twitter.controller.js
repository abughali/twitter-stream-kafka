const config = require('../config/app.config');
const kafka = require('./kafka.controller');

const needle = require('needle');
const {CompressionTypes} = require("kafkajs");

// this sets up two rules - the value is the search terms to match on, and the tag is an identifier that
// will be applied to the Tweets return to show which rule they matched
// with a standard project with Basic Access, you can add up to 25 concurrent rules to your stream, and
// each rule can be up to 512 characters long

// Edit rules as desired below
const rules = [{
    'value': 'musk lang:en',
    'tag': 'musk'
}
];

async function getAllRules() {

    const response = await needle('get', config.RULES_URL, {
        headers: {
            "authorization": `Bearer ${config.BEARER_TOKEN}`
        }
    })

    if (response.statusCode !== 200) {
        console.log("Error:", response.statusMessage, response.statusCode)
        throw new Error(response.body);
    }

    return (response.body);
}

async function deleteAllRules(rules) {

    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', config.RULES_URL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${config.BEARER_TOKEN}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);

}

async function setRules() {

    const data = {
        "add": rules
    }

    const response = await needle('post', config.RULES_URL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${config.BEARER_TOKEN}`
        }
    })

    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }

    return (response.body);

}

const stream = needle.get(config.SEARCH_STREAM_URL, {
    headers: {
        "User-Agent": "v2FilterStreamJS",
        "Authorization": `Bearer ${config.BEARER_TOKEN}`
    },
    timeout: 20000
});

async function produceEvent(data) {

    const run = async () => {
        await kafka.producer.connect();
        await kafka.producer.send({
            topic: config.TOPIC_NAME,
            compression: CompressionTypes.GZIP,
            acks: 0, // no ack
            messages: [
                {value: data},
            ],
        });
    }

    run().catch((e) => {
        console.log(e);
    })
}

async function sampleStream(retryAttempt) {

    stream.on('data', data => {
        try {

            const json = JSON.parse(data);
            console.log(json);

            produceEvent(data);

            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            // Catches error in case of 401 unauthorized error status.
            if (data.status === 401) {
                console.log(data);
            } else if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
            } else {
                // Keep alive signal received. Do nothing.
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream.
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                sampleStream(++retryAttempt);
            }, 2 ** retryAttempt);
        }
    });
    return stream;
}

async function searchStream(retryAttempt) {


    stream.on('data', data => {
        try {

            const json = JSON.parse(data);
             console.log(JSON.stringify(json));

            produceEvent(data);

            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
            } else {
                // Keep alive signal received. Do nothing.
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream.
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                searchStream(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });

    return stream;

}

async function searchStreamProducer() {
    let currentRules;

    try {
        // Gets the complete list of rules currently applied to the stream
        currentRules = await getAllRules();

        // Delete all rules. Comment the line below if you want to keep your existing rules.
        await deleteAllRules(currentRules);

        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        await setRules();

    } catch (e) {
        console.error(e);
    }

    // Listen to the stream.
    await searchStream(0);
}

async function sampleStreamProducer() {
    // Listen to the stream.
    await sampleStream(0);
}

module.exports = {searchStreamProducer, sampleStreamProducer, stream};