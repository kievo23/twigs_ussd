const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');

//MODELS
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
//SMS
const sendSMS = require('../functions/sendSMS');

let resetPassword = (customer,text,req,res) => {
    
    let array = _.split(text,'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(size);
    if(size == 1 && text == ""){
        let response =`CON Welcome to M-Weza Platform
        Enter your one time password`
        res.send(response)
    }else if(size == 1 && text != ""){
        console.log(firstString)
        let rst = bcrypt.compareSync(firstString, customer.pin);
        if(rst != 1){
            let response =`CON You entered a wrong password
            00. Go back to the main menu`
            res.send(response)
        }else{
            let response =`CON Enter your new password (four digits)`
            res.send(response)
        }
    }else if(size == 2){
        let response =`CON Confirm your new password (four digits)`
        res.send(response)
    }else if(size == 3){
        let confirmPassword = array[2]
        let newPasword = array[1]
        if(newPasword == confirmPassword){
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(newPasword, salt);
            customer.pin_reset = 0
            customer.pin = hash
            customer.salt_key = salt
            customer.save((err, success) => {
                if(err){
                    let response =`CON Sorry, Something went wrong`
                    res.send(response)
                }else{
                    let response =`CON Congratulations, you have activated your account`
                    res.send(response)
                }
            })
            let response =`END Congratulations, you have activated your account`
            res.send(response)
        }else{
            let response =`CON Your passwords dont match.
            00. Retry`
            res.send(response)
        }
        console.log(text)
    }
}

module.exports = resetPassword;