require('dotenv').config({path: '.env'});

module.exports = {
    BOOTSTRAP_SERVERS: process.env.KAFKA_BOOTSTRAP_SERVERS,
    CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    SCRAM_USER: process.env.KAFKA_SCRAM_USER,
    SCRAM_PASSWORD: process.env.KAFKA_SCRAM_PASSWORD,
    SASL_MECHANISM: process.env.KAFKA_SASL_MECHANISM,
    TOPIC_NAME: process.env.KAFKA_TOPIC,
    API_KEY: process.env.KAFKA_API_KEY,
    BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
    RULES_URL: process.env.TWITTER_RULES_URL,
    SEARCH_STREAM_URL: process.env.TWITTER_SEARCH_STREAM_URL,
    SAMPLE_STREAM_URL: process.env.TWITTER_SAMPLE_STREAM_URL
};