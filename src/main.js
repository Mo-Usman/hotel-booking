const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user-router')
const hotelRouter = require('../src/routers/hotel-router')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(hotelRouter)


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})