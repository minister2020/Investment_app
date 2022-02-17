require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const Joi = require('Joi')


const generateOTP = () =>{
return Math.floor( Math.random() * 1000000)
}


const getCustomer = (req, res) => {
   
    const { customer } = req.params
   
        res.status(200).send({
            status: true,
            message: 'customer deatils fetched',
            data: userDetails || []
        })
    
}


const createNewCustomer = async (req, res) =>{

        const userSchema = Joi.object({
            fulltname: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string(), 
            password: Joi.string().alphanum().required(),
        })
    
        const validateUser = userSchema.validate(req.body)
        if (validateUser.error) {
            res.status(422).send({
                status: false,
                message: "Bad Request",
                data: []
            })
        }
        
  const { fulltname,  email, phone, password } = req.body

  const customer_id = uuidv4()
  const otp = generateOTP()
}


module.exports = {
    createNewCustomer,
    generateOTP,
    getCustomer
}