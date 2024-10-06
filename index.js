const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('./utils/error.handler.js')


const app = express()

let corsOption = {
    origin: '*'
}

const db = require('./models')
db.sequelize.sync({force: false, alter: false})
    .then(() => {
        console.log("Database connected")  //successfull connection
    })
    .catch((err) => {
        console.error(`Error connecting database ${err.message}`)
    })

app.use(cors(corsOption))

//parse request of content_type application/json
app.use(express.json())

//parse request of content_type aplication/x-www-form-urllencoded
app.use(express.urlencoded({ extende: true }))


app.get('/api', (req, res) => {
    res.json({
        message: 'welcome homepage please navigate to the endpoint you wish to access'
    })
})

app.get('/', (req, res) => {
    res.json({
        message: 'welcome to homepage'
    })
})

require('./routes/route.js')(app)



app.use(errorHandler);
app.listen(process.env.PORT || 8000, () => {
    console.log('server is running on port:' + process.env.PORT || 8000)
})
