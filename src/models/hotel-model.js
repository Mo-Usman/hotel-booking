const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    city : {
        type: String,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rooms: {
        type: [ String ]
    }
})

hotelSchema.virtual('bookedHotels', {
    ref: 'User',
    localField: '_id',
    foreignField: 'bookedHotels.bookedHotel'
})

const Hotel = new mongoose.model('Hotel', hotelSchema)

module.exports = Hotel