const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');

//MODELS
const Person = require('../models/Person');
const Customer = require('../models/Customer');
const sendSMS = require('../functions/sendSMS');

//functions
const registration = require('../functions/registration');
const mpesaApi = require('../functions/mpesa');

//configs
const config = require(__dirname + '/../config.json');

router.post('/optin', async (req, res) => {
    if(!req.body.phone){
        res.send("have a phone parameter")
    }
    let customer = await Customer.findOne({ where: { customer_account_msisdn : req.body.phone } });
    console.log(req.body.phone)
    if(customer){
      registration.notifyTwiga(customer);
    }else{
      res.send("customer not found")
    }
    res.send('Authorized');
  });

router.post('/stkpush', async (req, res) => {
    const testMSISDN = "+254710345130"
    const amount = 100
    const accountRef = Math.random().toString(35).substr(2, 7)
    let result = await mpesaApi.lipaNaMpesaOnline(testMSISDN, amount, config.mpesa.STKCallbackURL + '/lipanampesa/success', accountRef)
    res.send(JSON.stringify(result))
});  

module.exports = router;