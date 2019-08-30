const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');

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
    let deliveries = await Delivery.findOne({ where: { status : 0 } })
    let loans = await LoanAccount.findAll({ where: { loan_status : 0 } })
    let balance = 0
    let count = 0
    let dates = ''
    console.log(deliveries)
    for (index = 0; index < loans.length; ++index) {
        balance += loans[index].loan_balance
        console.log(loans[index].loan_balance)
        count = count + 1
        dates = dates + loans[index].created_at+", "
    }
    let array = _.split(textnew[arraylength],'*');
    let size = array.length;
    let lastString = _.last(array)
    let firstString = _.first(array)
    console.log(textnew)
    console.log(array)
    if(size == 1 || lastString == 0){
        console.log("Main Menu");
        let response = `CON Welcome, Your loan balance is ${balance} KES
        1. Active Deliveries
        2. Make Payment in Full
        3. Make Partial Payment
        4. Check LoanLimit`
        res.send(response)
    }else if(size == 2){
        if(lastString == 1){
            //Active Deliveries
            //console.log(deliveries);
            let response = `CON Your ${count} unpaid delivery of ${balance} KES done on ${dates}            
            #. To go back to the main menu`
            res.send(response);
        }else if(lastString == 2){
            //Make Payment
            const testMSISDN = customer.customer_account_msisdn.substring(customer.customer_account_msisdn.length - 12)
            //console.log(testMSISDN)
            const amount = balance
            const accountRef = Math.random().toString(35).substr(2, 7)
            //res.send(JSON.stringify(result))
            let result = await mpesaAPI.lipaNaMpesaOnline(testMSISDN, amount, config.mpesa.STKCallbackURL + '/lipanampesa/success', accountRef)
            checkoutFunc(result.data,customer.customer_account_msisdn,amount,config.mpesa.ShortCode)
            let response = `END Wait for the MPesa prompt`
            res.send(response)
        }else if(lastString == 3){
            //Check loan Limit
            let response = `CON Input Amount To Pay
            #. To go back to the main menu`
            res.send(response);
        }
        else if(lastString == 4){
            //Check loan Limit
            let response = `CON Your loan limit is ${customer.account_limit} KES
            #. To go back to the main menu`
            res.send(response);
        }
    }else if(size == 3){
        //Make Payment
        const testMSISDN = customer.customer_account_msisdn.substring(customer.customer_account_msisdn.length - 12)
        //console.log(testMSISDN)
        const amount = lastString
        const accountRef = Math.random().toString(35).substr(2, 7)
        //res.send(JSON.stringify(result))
        let result = await mpesaAPI.lipaNaMpesaOnline(testMSISDN, amount, config.mpesa.STKCallbackURL + '/lipanampesa/success', accountRef)
        console.log(result.data)
        let rcd = checkoutFunc(result.data,customer.customer_account_msisdn,amount,config.mpesa.ShortCode)
        console.log(rcd)
        let response = `END Wait for the MPesa prompt`
        res.send(response);
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

module.exports = CustomerModule;