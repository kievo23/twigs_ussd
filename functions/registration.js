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

let registration = async(text,req, res) => {
    
    let array = _.split(text,'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(array);
    if(size == 1){
        let response = `CON Enter Customer surname`
        res.send(response)
    }else if(size == 2){
        let response = `CON Enter Customer first name`
        res.send(response)
    }else if(size == 3){
        let response = `CON Enter Customer other names`
        res.send(response)
    }else if(size == 4){
        let response = `CON Enter Customer National ID`
        res.send(response)
    }else if(size == 5){
        let response = `CON Enter Customer Gender e.g. m for male or f for female`
        res.send(response)
    }else if(size == 6){
        let response = `CON Enter Customer Date of Birth e.g. 1979-12-30`
        res.send(response)
    }else if(size == 7){
        let response = `CON Enter Customer Primary Phone No.`
        res.send(response)
    }else if(size == 8){
        let response = `CON Enter Customer Alternative Phone No.`
        res.send(response)
    }else if(size == 9){
        let response = `CON Enter Physical location.`
        res.send(response)
    }else if(size == 10){
        let response = `CON Confirm customer registration?. 
        1. Complete registration`
        res.send(response)
    }else if(size == 11){
        let surname = array[1];
        let firstname = array[2];
        let othernames = array[3];
        let id = array[4];
        let gender = array[5];
        let dob = array[6];
        let phone = "+254"+last(array[7], 9);
        let alternative_phone = "+254"+last(array[8], 9);;
        let location = array[9];
        
        let person = await Person.findOne({ where: {id_number: id} })
            // project will be the first entry of the Projects table with the title 'aProject' || null
            //console.log(person);
        if(!person){
            let person = await Person.create({
                surname: surname,
                first_name: firstname,
                other_names: othernames,
                gender: gender,
                date_of_birth: dob,
                id_number: id,
                primary_msisdn: phone,
                alternate_msisdn: alternative_phone,
                physical_location: location,
            })
            let code = Math.floor(1000 + Math.random() * 9000);
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(code.toString(), salt);
            let customer = await Customer.findOne({ include: [Person], where: {customer_account_msisdn: phone} })
            if(!customer){
                customer = await Customer.create({
                    customer_account_msisdn: phone,
                    person_id: person.id,
                    pin_reset: 1,
                    pin: hash,
                    salt_key: salt
                });
            }
            // let response =`CON Registration successful!!`
            // return response
            notifyTwiga(customer);
            sendSMS(phone,"Your one time password is: "+code);
            let response =`END Registration successful!!`
            res.send(response)
        }else{
            let customer = await Customer.findOne({ where: {customer_account_msisdn: phone} })
            if(!customer){
                let code = Math.floor(1000 + Math.random() * 9000);
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(code.toString(), salt);
                let customer = Customer.create({
                    customer_account_msisdn: phone,
                    person_id: person.id,
                    pin_reset: 1,
                    pin: hash,
                    salt_key: salt
                }).then((customer) => {
                    sendSMS(phone,"Your one time password is: "+code);
                    notifyTwiga(customer);
                    let response =`END Registration successful!!`
                    res.send(response)
                }); 
            }else{
                let response =`END Client is already registered!!`
                res.send(response)
            }
        }       

        let response =`END Registration successful!!`
        return response
    }
}

let notifyTwiga = (user) => {
    Customer.findOne({ include: [Person], where: {customer_account_msisdn: user.customer_account_msisdn} })
    .then(function(customer){
        if(customer){
            var options = { method: 'POST',
            url: 'https://staging.dms-v2.api.twiga.tech/integrations/fintech/v2/opt_in',
            headers:
            {
                'cache-control': 'no-cache',
                'Content-Type' : 'application/json',
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

            request(options, function (error, response, body, user) {
                if (error) throw new Error(error); 
                
                let obj = JSON.parse(response.request.body);
                Customer.findOne({ where : {customer_account_msisdn: obj.phone_number } })
                .then(function(user){
                    if(response.statusCode == 200){
                        //customer is verified by twiga. And is actually a twiga customer
                        user.active = 1;
                        user.account_limit = 5000;
                    }
                    user.twiga_response = JSON.stringify(body);
                    user.save((err, user)=>{
                        if(err) console.log(err);
                        console.log(user);
                    });
                    
                });
                let res = `Twiga Notified`;
                return res;
            });
            return true;
        }else{
            return false;
        }
    });
}

module.exports = {
    registration: registration,
    notifyTwiga: notifyTwiga
}