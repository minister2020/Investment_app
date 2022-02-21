
const express = require('express')
const router = express.Router()
const customersController  = require('../controllers/customer.controller')



router.post('/create_customer', customersController.createNewCustomer )

router.get('/customer/verify-otp/:customer/:email/:otp', customersController.verifyOTP)

router.get('/customer', customersController.getCustomer )

router.put('/customer', customersController.updateCustomer)

router.get('/user/resend-otp/:phone', customersController.resendOtp)




module.exports = router












