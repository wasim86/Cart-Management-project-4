const express = require('express')
const mongoose = require('mongoose')
const route = require('./route/route')
const app = express()
const multer = require('multer')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(multer().any())

mongoose.connect('mongodb+srv://Wasim:sjdwsm86@mycluster.hazwc4e.mongodb.net/group02Database', {
    useNewUrlParser: true
}, mongoose.set('strictQuery', false))
    .then(() => console.log("mongoose is connected"))
    .catch(err => console.log(err))

app.use('/', route)



app.listen(3000, () => {
    console.log('express app running on port 3000')
})