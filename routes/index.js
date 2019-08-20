const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
const Customer_Type = require('../models/Customer_Account_Type');
const sendSMS = require('../functions/sendSMS');

//functions
const registration = require('../functions/registration');
const resetPassword = require('../functions/resetPassword');
const customerModule = require('../functions/customer');

router.get('/', (req, res) => {
  res.send('Twiga Two Application');
});

router.post('*', async (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body
  let phone = "+254"+phoneNumber.substring(phoneNumber.length - 9);

  let customer = await Customer.findOne({ include: [Person], where: { customer_account_msisdn : phone } });
  //console.log(customer.person.FIRST_NAME);
  let agent = await Agent.findOne({ include: [Person], where: { agent_msisdn : phone } });
  //console.log(agent);
  if(!customer && !agent){
    let response = `END Kindly contact M-Weza agent to register your account`
    res.send(response);
  }else if(agent){
    //console.log("agent")
    return agentUssd(agent,text,req, res);
  }
  else if(customer){
    return customerUssd(customer,text,req,res);
  }
});


agentUssd : function agentUssd(agent,text,req, res){
  let array = _.split(text,'*')
  let lastString = _.last(array)
  let firstString = _.first(array)
  if(agent.pin_reset == 1){
    console.log("reset password")
    return resetPassword(agent,text);
  }else  if(agent.active != 1){
    console.log("not activated")
    let response = `CON agent ${agent.person.first_name} your account is not actived`
    res.send(response)
  }else if(text == '' || lastString== '00'){
    console.log("welcome screen")
    let response = `CON Welcome agent ${agent.person.first_name} your account is ready!!
    1. Register Customer
    2. Activate Customer
    3. Reset a Customer Password`
    res.send(response)
  }else if(firstString == '1'){
    return registration.registration(text,req, res)
  }else if(text == '2'){
    let response =`CON Enter Customer Number`
    res.send(response)
  }else if(text == '3'){
    let response =`CON Enter Customer Number`
    res.send(response)
  }
}


customerUssd : function customerUssd(customer,text,req,res){
  let array = _.split(text,'*')
  let lastString = _.last(array)
  let firstString = _.first(array)
  if(customer.pin_reset == 1) {
    return resetPassword(customer,text,req,res);
  }
  else if(customer.active != 1) {
    let response = `END ${customer.person.first_name} your account is not actived`
    res.send(response)
  }else if (text == '' || lastString== '00') {
    // This is the first request. Note how we start the response with CON
    let response = `CON Welcome ${customer.person.first_name} to Twiga Payments Platform
    Input your password to proceed`
    //console.log(req.session);
    res.send(response)
  } else if (firstString.length == 4) {
    // Business logic for first level response
    // BUSINESS LOGIC FOR
    //console.log(array[0])
    let rst = bcrypt.compareSync(array[0], customer.pin);
    if(rst == true){
      return customerModule(customer,text,req,res)
    }else{
      let response = `CON Wrong password.
      00. go back to previous menu`
      res.send(response)
    }   
  } else {
    let response = `CON Invalid Input
    00. Main Menu
    CANCEL. End USSD`
    res.send(response)
  }
}

module.exports = router;