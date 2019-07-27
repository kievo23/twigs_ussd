const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');
const last = require('voca/last');

//MODELS
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
//SMS
const sendSMS = require('../functions/sendSMS');

let registration = (text,req) => {
    
    let array = _.split(text,'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    //console.log(size);
    if(size == 1){
        let response =`CON Enter Customer surname`
        return response
    }else if(size == 2){
        let response =`CON Enter Customer first name`
        return response
    }else if(size == 3){
        let response =`CON Enter Customer other names`
        return response
    }else if(size == 4){
        let response =`CON Enter Customer National ID`
        return response
    }else if(size == 5){
        let response =`CON Enter Customer Gender e.g. m for male or f for female`
        return response
    }else if(size == 6){
        let response =`CON Enter Customer Date of Birth e.g. 1979-12-30`
        return response
    }else if(size == 7){
        let response =`CON Enter Customer Primary Phone No.`
        return response
    }else if(size == 8){
        let response =`CON Enter Customer Alternative Phone No.`
        return response
    }else if(size == 9){
        let response =`CON Enter Physical location.`
        return response
    }else if(size == 10){
        let response =`CON Congratulations, Register the client?.`
        return response
    }else if(size == 11){
        let surname = array[1];
        let firstname = array[2];
        let othernames = array[3];
        let id = array[4];
        let gender = array[5];
        let dob = array[6];
        let phone = "+254"+last(array[7], 9);;
        let alternative_phone = array[8];
        let location = array[9];

        Person.findOne({ where: {ID_NUMBER: id} })
        .then(person => {
            // project will be the first entry of the Projects table with the title 'aProject' || null
            //console.log(person);
            if(!person){
                let person = Person.create({
                    SURNAME: surname,
                    FIRST_NAME: firstname,
                    OTHER_NAMES: othernames,
                    GENDER: gender,
                    DATE_OF_BIRTH: dob,
                    ID_NUMBER: id,
                    PRIMARY_MSISDN: phone,
                    ALTERNATE_MSISDN: alternative_phone,
                    PHYSICAL_LOCATION: location,
                }).then((person) => {
                    let code = Math.floor(1000 + Math.random() * 9000);
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(code.toString(), salt);
                    let customer = Customer.create({
                        CUSTOMER_MSISDN: phone,
                        PERSON_ID: person.PERSON_ID,
                        PIN_RESET: 1,
                        PIN: hash,
                        SALT_KEY: salt
                    }).then(() => {
                        // let response =`CON Registration successful!!`
                        // return response
                        sendSMS(phone,"Your one time password is: "+code);
                    });            
                });
            }else{
                Customer.findOne({ where: {CUSTOMER_MSISDN: phone} })
                .then((customer) => {
                    if(!customer){
                        let code = Math.floor(1000 + Math.random() * 9000);
                        let salt = bcrypt.genSaltSync(10);
                        let hash = bcrypt.hashSync(code.toString(), salt);
                        let customer = Customer.create({
                            CUSTOMER_MSISDN: phone,
                            PERSON_ID: person.PERSON_ID,
                            PIN_RESET: 1,
                            PIN: hash,
                            SALT_KEY: salt
                        }).then((cus) => {
                            sendSMS(phone,"Your one time password is: "+code);
                            let response =`CON Registration successful!!`
                            return response
                        }); 
                    }else{
                        let response =`CON Client is already registered!!`
                        return response
                    }
                })
            }
        });          

        let response =`CON Registration successful!!`
        return response
    }
}

module.exports = registration;