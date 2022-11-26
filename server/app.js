const kafka = require('./controllers/kafka.controller.js');
const twitter = require('./controllers/twitter.controller.js');

const express = require('express');
const EventEmitter = require('events');

const app = express();

const server = app.listen(3001, () => {
        kafka.startConsumer().then(() => {
            console.log('Consumer is starting')
        });
        console.log('===> Server started')
    }
);

const eventHandler = new EventEmitter();
let started = false;

eventHandler.on('searchStream', async () => {
    started = true;
    await twitter.searchStreamProducer();
})

eventHandler.on('sampleStream', async () => {
    started = true;
    await twitter.sampleStreamProducer();
})

// disable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Expose-Headers', '*')
    next();
})

// api to start producer to kafka
app.get('/start-search', (req, res) => {
    if (!started) {
        eventHandler.emit('searchStream')
        res.status(200).send('Starting Search Stream in progress');
    } else {
        res.status(200).send('Producer has been already started or in progress');
    }

});

// api to start producer to kafka
app.get('/start-sample', (req, res) => {
    if (!started) {
        eventHandler.emit('sampleStream')
        res.status(200).send('Starting Sample Stream in progress');
    } else {
        res.status(200).send('Producer has been already started or in progress');
    }

});

// api to expose events data from kafka to frontend
app.get('/events', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let response = '[';
    let separator = "";
    let events = kafka.eventQueue;
    for (let i = 0; i < events.length; i++) {
        response += separator + events[i];
        separator = ','
    }
    response += ']'
    res.status(200).send(response);
});


process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(async () => {
        twitter.stream.abort();
        await kafka.consumer.disconnect()
        await kafka.producer.disconnect()
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}