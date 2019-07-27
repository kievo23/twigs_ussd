var config = require(__dirname + '/../config.json');
var last = require('voca/last');
// Set your app credentials

const credentials = {
    apiKey: config.sms.apiKey,
    username: config.sms.username,
}

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;

let sendMessage = function sendMessage(phoneNumber,message) {
    let phone = "+254"+last(phoneNumber, 9);
    console.log(phone)
    const options = {
        // Set the numbers you want to send to in international format
        to: [phone],
        // Set your message
        message: message,
        // Set your shortCode or senderId
        from: config.sms.senderID
    }

    // That’s it, hit send and we’ll take care of the rest
    sms.send(options)
        .then(console.log)
        .catch(console.log);
}

module.exports = sendMessage;