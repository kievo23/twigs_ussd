const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');

//MODELS
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
//SMS
const sendSMS = require('../functions/sendSMS');

let CustomerModule = (customer,text) => {
    
    let array = _.split(text,'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(size);
    if(size == 1){
        let response =`CON Main Menu
        1. Active Deliveries
        2. Pending Deliveries
        3. Make Payment
        4. Check Loan Limit`
        return response
    }else if(size == 2){
        if(lastString == 1){
            //Active Deliveries
            
        }else if(lastString == 2){
            //Pending Deliveries

        }else if(lastString == 3){
            //Make Payment

        }else if(lastString == 4){
            //Check loan Limit

        }
    }
}

module.exports = CustomerModule;