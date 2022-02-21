require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const Joi = require('Joi')
const bcrypt = require('bcrypt')
const util = require('util')
const { isEmpty, doSomeAsyncMagik } = require('../utils/utils')
const smsServices = require('../services/sms.services')
const emailServices = require('../services/email.services')
const customersModel = require('../models/customer.models')


const generateOTP = ()=>{

    return Math.floor(Math.random() * 10000)
}


const getCustomer = async(req, res) => {
   
    const  email  = req.body.customerEmail

    const [err, getCustomerDetails] = await doSomeAsyncMagik(customersModel.getCustomerDetailsByEmail(email))
    try {
        if (err) {
            throw new Error("Unable to complete action")
        }
     
        res.status(200).send({
            status: true,
            message: "customers detils fetched",
            data: getCustomerDetails
        })
    } catch (e) {
        res.status(400).send({
            status: false,
            message: "Error"
        })
    }
}

const createNewCustomer = async (req, res) => {

 
    const userSchema = Joi.object({
        firstname: Joi.string().required(),
        surname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
    })

    const validateUser = userSchema.validate(req.body)
    if (validateUser.error) {

        res.status(422).send({
            status: false,
            message: "Bad Request"
        })
    }

    const { firstname, surname,email, password, phone } = req.body
    const customer_id = uuidv4()
    const otp = generateOTP()
    try {
        const [err, checkIfCustomerExists] = await doSomeAsyncMagik(customersModel.checkCustomer(email, phone))
        if (err) {
            
            throw new Error("Try again please,this is on us, something happened")
        }
        if (!isEmpty(checkIfCustomerExists)) {
            console.log("here: ", checkIfCustomerExists)
            throw new Error("User with Email/Phone exists")
        }
    
    
       
        await customersModel.newCustomer(firstname, surname, email, password , phone, customer_id)
        await customersModel.insertOtp(customer_id, otp)
       
        await smsServices.sendSMS(phone, `Hello, your otp is ${otp}`)  
       
        const customerFullname = `${firstname} ${surname}`
        const dataReplacement = {
            "fullname": customerFullname,
            "otp": otp
        }

        emailServices.readFileAndSendEmail (email, "OTP VERIFICATION", dataReplacement, 'otp')
        
        res.status(200).send({
            status: true,
            message: success,
            data: []
        })

    } catch (e) {
        res.status(400).send({
            status: false,
            message: "error"
        
        })
    }
}

const verifyOTP = (req, res) => {

    const { customer, email, otp } = req.params


    customersModel.getOtp(customer, otp)
    .then(otpResult => {
        if (otpResult == "") {
            throw new Error('otp does not match')
        }
        
        const elapsedTime = Date.now() -  otpResult[0].created_at
        if ((Math.floor(elapsedTime / 60000) > process.env.OTPExpirationTime)) {
            throw new Error('otp has expired')
        }
        
        customersModel.deleteOTP(otp, otpResult[0].customer_id)
        customersModel.updateOTPStatus(otpResult[0].customer_id)

    })
        .then(finalResponse => {
            const dataToUpdate = {}
    
            emailServices.readFileAndSendEmail (email, "WELCOME ONBOARD", dataToUpdate, 'welcome')
            
        res.status(200).send({
            status: false,
            message: "opt verification successful",
            data: []
        })
    })
    .catch(err => {
        res.status(400).send({
            status: false,
            message: "error",
            data: []
        })
    })



}


const updateCustomer = () => {

    res.status(200).send({
        status: true,
        message: "Account successfully updated",
        data: []
    })
}


const resendOtp =   async (req, res) => {
    const { phone } = req.params
    const otp = generateOTP()
    
    try {

        const customerDetails = await customersModel.getCustomerDetailsByPhone(phone)
        await customersModel.deleteOTPByCustomerID(customerDetails[0].customer_id)
        await customersModel.insertOtp(customerDetails[0].customer_id, otp)
        await smsServices.sendSMS(phone, `Hello, your new otp is ${otp}`)
        
        res.status(200).send({
            status: true,
            message: "otp resend successfully",
            data: []
        })

    } catch (err) {
        console.log(err)
        res.status(200).send({
            status: true,
            message: "error",
            data: []
        })
    }


  
}

module.exports = {
    createNewCustomer,
    getCustomer,
    updateCustomer,
    verifyOTP,
    resendOtp
    
}