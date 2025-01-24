require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const productRoutes = require('./routes/productRoutes.js')
const errorMiddleware = require('./middleware/errorMiddleware.js')
var cors = require('cors')

app.use(cors())
app.use(express.json())

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 3000

app.use('/api/products', productRoutes)

app.get('/', function (req, res) {
    res.send('Hello World')
})


app.get('/testing', function (req, res) {
    res.send('This is testing page')
})

app.use(errorMiddleware)

    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("Connected to the database")
            app.listen(PORT, ()=>{
                console.log(`Server listening on port ${PORT}`);
            })
        }).catch((error)=>{
            console.log(error)
        })