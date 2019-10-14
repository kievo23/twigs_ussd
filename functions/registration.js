const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');
const last = require('voca/last');
const request = require("request");
//MODELS
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
//Config
const config = require(__dirname + '/../config.json');
//SMS
const sendSMS = require('../functions/sendSMS');

let registration = async(text,req, res, agent) => {
    
    let array = _.split(text,'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(array);
    if(size == 1){
        let response = `CON Enter the customer's Surname`
        res.send(response)
    }else if(size == 2){
        let response = `CON Enter the customer's First Name`
        res.send(response)
    }else if(size == 3){
        let response = `CON Enter the customer's Other Names`
        res.send(response)
    }else if(size == 4){
        let response = `CON Enter the customer's National ID`
        res.send(response)
    }else if(size == 5){
        let response = `CON Enter the customer's Gender e.g. M for Male or F for Female`
        res.send(response)
    }else if(size == 6){
        let response = `CON Enter the customer's Date of Birth e.g. 1979-12-30`
        res.send(response)
    }else if(size == 7){
        let response = `CON Enter the customer's Primary Phone No.`
        res.send(response)
    }else if(size == 8){
        let response = `CON Enter the customer's Alternative Phone No.`
        res.send(response)
    }else if(size == 9){
        let response = `CON Enter the customer's Physical location.`
        res.send(response)
    }else if(size == 10){
        let response = `CON Confirm customer's registration?. 
        1. Complete registration`
        res.send(response)
    }else if(size == 11){
        let surname = array[1].trim();
        let firstname = array[2].trim();
        let othernames = array[3].trim();
        let id = array[4].trim();
        let gender = array[5].trim();
        let dob = array[6].trim();
        let phone = "+254"+last(array[7].trim(), 9);
        let alternative_phone = "+254"+last(array[8].trim(), 9);;
        let location = array[9];
        
        let person = await Person.findOne({ where: {id_number: id} })
            // project will be the first entry of the Projects table with the title 'aProject' || null
            //console.log(person);
            //console.log(agent);
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
                    salt_key: salt,
                    agent_id: parseInt(agent.id)
                });
                notifyTwiga(customer);
                sendSMS(phone,"Welcome "+person.first_name+", your One Time Password is: "+code+". Kindly dial *483*818# to complete the registration process");
                let response =`END Registration successful!!`
                res.send(response)
            }else{
                let response =`END Client is already registered!!`
                res.send(response)
            }
            // let response =`CON Registration successful!!`
            // return response
            
        }else{
            let customer = await Customer.findOne({ where: {customer_account_msisdn: phone} })
            if(!customer){
                let code = Math.floor(1000 + Math.random() * 9000);
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(code.toString(), salt);
                let customer = await Customer.create({
                    customer_account_msisdn: phone,
                    person_id: person.id,
                    pin_reset: 1,
                    pin: hash,
                    salt_key: salt,
                    agent_id: parseInt(agent.id)
                })
                sendSMS(phone,"Welcome "+person.first_name+", your One Time Password is: "+code+". Kindly dial *483*818# to complete the registration process");
                notifyTwiga(customer);
                let response =`END Registration successful!!`
                res.send(response)
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
        console.log("customer")
        //console.log(customer)
        if(customer){
            var options = { method: 'POST',
            url: config.twiga.url+'opt_in',
            headers:
            {
                'cache-control': 'no-cache',
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+config.twiga.bearerToken
            },
            body: 
            {
                opt_in: true,
                phone_number: customer.customer_account_msisdn,
                document_type: 'ID',
                document_number: customer.person.id_number,
                full_name: customer.person.surname +' '+ customer.person.first_name +' '+ customer.person.other_names
            },
            json: true };

            request(options, function (error, response, body, user) {
                if (error) throw new Error(error); 
                
                let obj = JSON.parse(response.request.body);
                console.log(response.statusCode)
                Customer.findOne({ where : {customer_account_msisdn: obj.phone_number } })
                .then(function(user){
                    if(response.statusCode == 200){
                        console.log("customer is verified by twiga. And is actually a twiga customer")
                        user.active = true;
                        user.account_limit = 5000.00;
                    }
                    user.twiga_response = JSON.stringify(body);
                    user.save((err, user)=>{
                        if(err) console.log(err);
                        console.log(user);
                    }); 
                    //console.log(user)                   
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