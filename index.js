require('dotenv').config()                              
const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const customerRoutes = require('./routes/customer.routes')

const port = process.env.PORT




app.use(bodyParser.json())


app.use(customerRoutes)


app.listen(port , ()=> {
    console.log(`i am listening on ${port}`)
})

app.get('/', (req, res)=> {
  res.status(200).send({
      status: 'success',
      message: 'welcome guys',
      data: []
  })

})

app.use('/', (req, res)=> {
    res.status(400).send({
        status: 'Error',
        message: 'seems you get loss',
        data: []
    })
  
  })

    