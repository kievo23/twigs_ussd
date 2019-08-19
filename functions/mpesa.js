const Mpesa = require('mpesa-node')
const config = require(__dirname + '/../config.json');

const mpesaApi = new Mpesa({ 
    consumerKey: config.mpesa.consumer_key, 
    consumerSecret: config.mpesa.consumer_secret,
    environment: config.mpesa.environment
})

module.exports = mpesaApi;