
const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customer.controller')





router.post('/customer/create', customerController.createNewCustomer)
router.get('/customer', customerController.getCustomer)







module.exports = router



