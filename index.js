require('dotenv').config()                              
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const customerRoutes = require('./routes/customer.routes')
const morgan = require('morgan')
//const displayRoutes = require('express-routemap')
const mySqlConnection = require('./confiq/mysql')




const port = process.env.PORT


app.use(bodyParser.json())
app.use(morgan('combined'))
app.use(customerRoutes)




app.listen(port , ()=> {
    console.log(`i am listening on ${port}`)
    
   // displayRoutes(app)
})


mySqlConnection.connect(err => {
    if (err) throw err.stack
    // connected!
    console.log('successfully connected: ' , mySqlConnection.threadId)
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

    