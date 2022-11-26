const config = require('../config/app.config.js');

const {Kafka, logLevel, Partitioners} = require('kafkajs');

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: config.BOOTSTRAP_SERVERS.split(','),
    clientId: config.CLIENT_ID,
    ssl: {
        rejectUnauthorized: false  // Skip Certs/Keys checks, not recommended for production
    },
    sasl: {
        mechanism: config.SASL_MECHANISM,
        username: config.SCRAM_USER,
        password: config.SCRAM_PASSWORD,
    },
    connectionTimeout: 3000 // default is 1000
});

const producer = kafka.producer({createPartitioner: Partitioners.DefaultPartitioner})
const consumer = kafka.consumer({groupId: 'group-1'});


const eventQueue = [];

async function startConsumer() {
    // connect the consumer and producer instances to Kafka
    await consumer.connect();

    // subscribe to the `twitter` topic
    await consumer.subscribe({topic: config.TOPIC_NAME, fromBeginning: true});

    const sub = async () => {
        await consumer.run({
            eachMessage: async ({message}) => {
                eventQueue.push(message.value)
            }
        });
    }
    sub().catch(console.error);
}

module.exports = {kafka, producer, consumer, startConsumer, eventQueue};

