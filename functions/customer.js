const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');

//MODELS
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
const Delivery = require('../models/Delivery_Notification');
//SMS
const sendSMS = require('../functions/sendSMS');

let CustomerModule =  async ( customer, text, req, res) => {
    let deliveries = await Delivery.findOne({ where: { status : 0 } })
    let array = _.split(text,'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(array);
    if(size == 1){
        console.log("Main Menu");
        let response =`CON Main Menu your loan balance is 
        1. Active Deliveries
        2. Pending Deliveries
        3. Make Payment
        4. Check Loan Limit`
        return response
    }else if(size == 2){
        if(lastString == 1){
            //Active Deliveries
            console.log(deliveries);
            let response = `CON You have an unpaid delivery of ${deliveries.amount} KES`
            res.send(response);
        }else if(lastString == 2){
            //Pending Deliveries
            let response = `CON You have dont have pending deliveries`
            res.send(response);
        }else if(lastString == 3){
            //Make Payment
            let response = `CON Wait for the MPesa prompt`
            res.send(response);
        }else if(lastString == 4){
            //Check loan Limit
            let response = `CON Your loan limit is 5000 KES`
            res.send(response);
        }
    }
}

module.exports = CustomerModule;