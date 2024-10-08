const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/user-router')
const hotelRouter = require('../src/routers/hotel-router')
const roomRouter = require('../src/routers/room-router')
const cookieParser = require('cookie-parser')

const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(userRouter)
app.use(hotelRouter)
app.use(roomRouter)

//  const User = require('./models/user-model')

// async function main () {
//     const user = await User.findById('665b2cc01c89b9d2be59d892')
//     await user.populate('bookedHotels.bookedHotel')
//     console.log(user.bookedHotels)
// }

//  main()

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})