const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');
const request = require("request");

//MODELS
const Person = require('../models/Person');
const Agent = require('../models/Sales_Agent');
const Customer = require('../models/Customer');
const Delivery = require('../models/Delivery_Notification');
const Checkout = require('../models/Checkout');
const LoanAccount = require('../models/Loan_Account');
//SMS
const sendSMS = require('../functions/sendSMS');
const mpesaAPI = require('../functions/mpesa');

//configs
const config = require(__dirname + '/../config.json');

let CustomerModule =  async ( customer, text, req, res) => {
    let textnew = _.split(text,'#')
    arraylength = textnew.length - 1
    //console.log(textnew.length)
    let deliveries = await Delivery.findAll({ 
        where: { status : 0, customer_id : customer.id },
        order: [ [ 'createdAt', 'DESC' ]],
    })

    let loans = await LoanAccount.findAll({include: [Delivery], where: { loan_status : 0, customer_account_id : customer.id } })
    let balance = 0
    let count = 0
    let dates = ''
    //console.log(deliveries)
    for (index = 0; index < loans.length; ++index) {
        balance += Math.ceil(parseFloat(loans[index].loan_balance))
        console.log(loans[index].loan_balance)
        count = count + 1
        dates = dates + loans[index].createdAt+", "
    }
    balance = parseFloat(balance).toFixed(2)
    let array = _.split(textnew[arraylength],'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(textnew)
    console.log(array)
    if(firstString == 1 || size == 1){
        //console.log("Main Menu");
        //var m = moment(dates)
        console.log(dates)
        let response = ""
        if(deliveries){
            response = `CON Your pending M-Weza balance is ${balance} KES 
1. Request M-Weza facilitation
2. Active Deliveries
3. Pay in Full
4. Pay Partially
5. Check Limit
6. Change PIN`
        }else{
            response = `CON Your pending M-Weza balance is ${balance} KES 
2. Active Deliveries
3. Pay in Full
4. Pay Partially
5. Check Limit
6. Change PIN`
        }
        
        res.send(response)
    }else if(size == 2){
        if(lastString == 2){
            //Active Deliveries
            //console.log(deliveries);
            let additionalString = "";
            for (i = 0; i < loans.length; ++i) {
                //console.log(loans[i])
    additionalString += `${i+1}. Delivery of KES: ${loans[i].delivery_notification.amount} receipt no: ${loans[i].delivery_notification.receipt_number} delivery done on ${loans[i].delivery_notification.createdAt}
`
            }
            let response = `CON You have ${count} unpaid delivery of KES: ${balance}  
${additionalString}
#. Back to main menu`     
            res.send(response);
        }else if(lastString == 3){
            //Make Payment
            const testMSISDN = customer.customer_account_msisdn.substring(customer.customer_account_msisdn.length - 12)
            //console.log(testMSISDN)
            const amount = Math.ceil(parseFloat(balance));
            //const accountRef = Math.random().toString(35).substr(2, 7)
            const accountRef = testMSISDN
            //res.send(JSON.stringify(result))
            let result = await mpesaAPI.lipaNaMpesaOnline(testMSISDN, amount, config.mpesa.STKCallbackURL + '/lipanampesa/success', accountRef)
            console.log(result.data)
            let rcd = checkoutFunc(result.data,customer.customer_account_msisdn,amount,config.mpesa.ShortCode)
            console.log(rcd)
            let response = `END Wait for the MPesa prompt`
            res.send(response);
        }else if(lastString == 4){
            //Check loan Limit
            let response = `CON Input Amount To Pay
#. To go back to the main menu`
            res.send(response);
        }
        else if(lastString == 5){
            //Check loan Limit
            let response = `CON Your facilitation limit is ${customer.account_limit} KES
#. To go back to the main menu`
            res.send(response);
        }else if(lastString == 6){
            //Check loan Limit
            let response = `CON Input customer number to reset
#. To go back to the main menu`
            res.send(response);
        }else if(lastString == 1){
            let additionalString = "";
            for (i = 0; i < deliveries.length; ++i) {
    additionalString += `${i+1}. Take a facilitation of KES: ${deliveries[i].amount} on this ${deliveries[i].receipt_number} delivery done on ${deliveries[i].createdAt}
`
            }
            let response = `CON You have ${count} unpaid delivery of KES: ${balance}  
${additionalString}
#. Back to main menu`
            res.send(response);
        }
    }else if(size == 3){
        //Make Payment
        if(array[1] == 4 ){
            const testMSISDN = customer.customer_account_msisdn.substring(customer.customer_account_msisdn.length - 12)
            //console.log(testMSISDN)
            const amount = Math.ceil(parseFloat(lastString))
            const accountRef = testMSISDN
            //res.send(JSON.stringify(result))
            let result = await mpesaAPI.lipaNaMpesaOnline(testMSISDN, amount, config.mpesa.STKCallbackURL + '/lipanampesa/success', accountRef)
            console.log(result.data)
            let rcd = checkoutFunc(result.data,customer.customer_account_msisdn,amount,config.mpesa.ShortCode)
            //console.log(rcd)
            let response = `END Wait for the MPesa prompt`
            res.send(response);
        }else if(array[1] == 1 ){
            //Make the delivery a loan entry
            let index = parseInt(lastString)- 1;
            
            let delivery = deliveries[index];
            if(Math.ceil(parseFloat(customer.account_limit)) > Math.ceil(parseFloat(balance + delivery.amount))){
                let loan = await LoanAccount.create({
                    'customer_account_id' : customer.id,
                    'delivery_id' : delivery.id,
                    'principal_amount' : delivery.amount,
                    'interest_charged' : 25.00,
                    'loan_amount' : delivery.amount + 25.00,
                    'loan_balance' : delivery.amount + 25.00,
                    'loan_penalty' : 0.00,
                    'loan_status' : 0
                });
    
                //Send loan confirmation
                let loanedAmount = delivery.amount + 25.00
                let deliveryAmount = delivery.amount
                let loan_reference_id = loan.id 
                let receipt_no = delivery.receipt_number
                LoanOfferConfirmation(loan,loanedAmount,deliveryAmount,loan_reference_id,receipt_no)
    
                //change delivery status
                delivery.status = 1;
                delivery.save((err, delivery)=>{
                    if(err) console.log(err);
                    console.log(delivery);
                });
    
                let response = `END Congratulations, M-Weza has paid for your delivery of KES: 
                ${delivery.amount + 25}`
                sendSMS(customer.customer_account_msisdn,`Congratulations, M-Weza has paid for your delivery of KES: 
                ${delivery.amount + 25}`);
                //sendSMS(phone,"Your one time password is: "+code);
                res.send(response);
            }else{
                let response = `END Sorry, Your request has exceeded your facilitation limit. Your limit is KES ${customer.account_limit}`
                res.send(response);
            }
            
        }else if(array[1] == 6 ){
            let code = Math.floor(1000 + Math.random() * 9000);
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(code.toString(), salt)
            let phone = "+254"+lastString.substring(lastString.length - 9);
            let customer = await Customer.findOne({ include: [Person], where: {customer_account_msisdn: phone} })
            console.log("reset password");
            if(customer){
                customer.pin_reset = 1
                customer.pin = hash
                customer.salt_key = salt
                customer.save((err, user)=>{
                    if(err) console.log(err);
                    console.log(user);
                });

                sendSMS(phone,"Welcome "+customer.person.first_name+", Your one time password is: "+code);
                let response =`END Password successfully reset`
                res.send(response)
            }
        }
    }
}

let checkoutFunc = async (json, phone, amount, shortcode ) =>{
    let rst = await Checkout.create({
        merchant_request_id: json.MerchantRequestID,
        checkout_request_id: json.CheckoutRequestID,
        response_code: json.ResponseCode,
        response_description: json.ResponseDescription,
        customer_message: json.CustomerMessage,
        msisdn: phone,
        amount: amount,
        payer_number: phone,
        paybill: shortcode
    })
    return rst
}

let LoanOfferConfirmation = async (loan,loanedAmount,deliveryAmount,loan_reference_id,receipt_no) => {
    var options = { method: 'POST',
    url: config.twiga.url+'confirm_loan',
    headers: 
    {   'cache-control': 'no-cache',
        'Authorization': 'Bearer '+config.twiga.bearerToken,
        'Content-Type': 'application/json' },
    body: 
    {   loaned_amount: deliveryAmount,
        due_date: '2019-09-13 12:55:00',
        delivery_amount: deliveryAmount,
        due_amount: loanedAmount,
        loan_reference_id: "mweza"+loan_reference_id,
        receipt_no: receipt_no },
    json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        loan.twiga_response = JSON.stringify(body);
        loan.save((err, loan)=>{
            if(err) console.log(err);
            console.log(loan);
        });

    });
}

module.exports = CustomerModule;