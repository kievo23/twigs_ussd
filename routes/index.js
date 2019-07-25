const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
const Customer_Type = require('../models/Customer_Account_Type');

//functions
const registration = require('../functions/registration');

router.get('*', (req, res) => {
  res.send('Twiga Two Application');
});

router.post('*', async (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body

  let customer = await Customer.findOne({ include: [Person], where: { CUSTOMER_MSISDN : phoneNumber } });
  //console.log(customer.person.FIRST_NAME);
  let agent = await Agent.findOne({ include: [Person], where: { AGENT_MSISDN : phoneNumber } });
  if(!customer && !agent){
    let response = `END Kindly contact M-Weza agent to register your account`
    res.send(response);
    res.end();
  }else if(agent){
    res.send(agentUssd(agent,text,req));
  }
  else if(customer){
    res.send(customerUssd(customer,text,req));
  } 
});





agentUssd : function agentUssd(agent,text,req){
  let array = _.split(text,'*')
  let lastString = _.last(array)
  let firstString = _.first(array)
  if(agent.ACTIVE != 1){
    let response = `CON agent ${agent.person.FIRST_NAME} your account is not actived`
    return response
  }else if(text == '' || lastString== '00'){
    let response = `CON Welcome agent ${agent.person.FIRST_NAME} your account is ready!!
    1. Register Customer
    2. Activate Customer
    3. Reset a Customer Password`
    return response
  }else if(firstString == '1'){
    return registration(text,req)
  }else if(text == '2'){
    let response =`CON Enter Customer Number`
    return response
  }else if(text == '3'){
    let response =`CON Enter Customer Number`
    return response
  }
}





customerUssd : function customerUssd(customer,text,req){
  let array = _.split(text,'*')
  let lastString = _.last(array)
  if(customer.ACTIVE != 1){
    let response = `END ${customer.person.FIRST_NAME} your account is not actived`
    return response
  }else if (text == '' || lastString== '00') {
    // This is the first request. Note how we start the response with CON
    let response = `CON Welcome ${customer.person.FIRST_NAME} to Twiga Payments Platform
    1. Active Deliveries
    2. Pending Deliveries
    3. Make Payments`
    //console.log(req.session);
    return response
  } else if (text == '1') {
    // Business logic for first level response
    let response = `CON Choose account information you want to view
    1. Account number
    2. Account balance`
    return response
  } else if (text == '2') {
    // Business logic for first level response
    let response = `END Your phone number is ${phoneNumber}`
    return response
  } else if (text == '1*1') {
    // Business logic for first level response
    let accountNumber = 'ACC1001'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your account number is ${accountNumber}`
    return response
  } else if (text == '1*2') {
    // This is a second level response where the user selected 1 in the first instance
    let balance = 'NGN 10,000'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your balance is ${balance}`
    return response
  } else {
    let response = `CON Invalid Input
    00. Main Menu
    CANCEL. End USSD`
    return response
  }
}

module.exports = router;