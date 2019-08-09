const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');
const last = require('voca/last');
const request = require("request");
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
        let response =`CON Congratulations, Register the client?. 
        1. Complete registration`
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
                    surname: surname,
                    first_name: firstname,
                    other_names: othernames,
                    gender: gender,
                    date_of_birth: dob,
                    id_number: id,
                    primary_msisdn: phone,
                    alternate_msisdn: alternative_phone,
                    physical_location: location,
                }).then((person) => {
                    let code = Math.floor(1000 + Math.random() * 9000);
                    let salt = bcrypt.genSaltSync(10);
                    let hash = bcrypt.hashSync(code.toString(), salt);
                    let customer = Customer.create({
                        customer_msisdn: phone,
                        person_id: person.PERSON_ID,
                        pin_reset: 1,
                        pin: hash,
                        salt_key: salt
                    }).then(() => {
                        // let response =`CON Registration successful!!`
                        // return response
                        sendSMS(phone,"Your one time password is: "+code);
                        let response =`END Registration successful!!`
                        return response
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
                            customer_msisdn: phone,
                            person_id: person.PERSON_ID,
                            pin_reset: 1,
                            pin: hash,
                            salt_key: salt
                        }).then((customer) => {
                            sendSMS(phone,"Your one time password is: "+code);
                            notifyTwiga(customer);
                            let response =`END Registration successful!!`
                            return response
                        }); 
                    }else{
                        let response =`END Client is already registered!!`
                        return response
                    }
                })
            }
        });          

        let response =`CON Registration successful!!`
        return response
    }
}

let notifyTwiga = (user) => {
    Customer.findOne({ include: [Person], where: {CUSTOMER_MSISDN: user.phone} })
    .then(function(d){
        console.log(d);
    });
    end();
    var options = { method: 'POST',
    url: 'https://staging.dms-v2.api.twiga.tech/integrations/fintech/v2/opt_in',
    headers:
    { 'Postman-Token': '9d4a5c4c-e846-44bd-830d-484d949c7512',
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Q3ts8iU8Bv4WpNnxE1V3Ry2OHe27rK1u'
     },
    body: 
    {
        opt_in: true,
        phone_number: user.customer_account_msisdn,
        document_type: 'ID',
        document_number: user.person.id_number,
        full_name: user.person.surname +' '+ user.person.first_name +' '+ user.person.other_names
    },
    json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}


module.exports = registration;