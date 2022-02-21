require('dotenv').config()
const axios = require('axios').default
const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')
//const formData = require('form-data')

const sendSMSOTP = (phone, otp) => {
    let templateCode = '7153792424'
    let bodyFormData = new formData()
    bodyFormData.append('token', process.env.SMS_TOKEN)
    bodyFormData.append('phone', phone)

    return axios({
        method: "post",
        url: `${process.env.SMS_API_BASE_URL}/smsotp/send/`,
        headers: { "Content-Type": "multipart/form-data" },
        data: bodyFormData
      })
 
}




const sendSMS = (toPhone, message) => {
    let type = 0 
    let routing = 3 
    let bodyFormData = new formData()
    bodyFormData.append('token', process.env.SMS_TOKEN)
    bodyFormData.append('sender', process.env.SMS_SENDER)
    bodyFormData.append('to', toPhone)
    bodyFormData.append('message', message)
    bodyFormData.append('type', type)
    bodyFormData.append('routing', routing)
    bodyFormData.append('ref_id', uuidv4())
    

    return fetch(`${process.env.SMS_API_BASE_URL}/sms/`, {
        body: bodyFormData,
        method: 'POST'
      })
}





module.exports = {
    sendSMSOTP,
    sendSMS
}