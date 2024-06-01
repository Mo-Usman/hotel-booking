const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    }
})

hotelSchema.virtual('bookedHotels', {
    ref: 'User',
    localField: '_id',
    foreignField: 'bookedHotels.bookedHotel'
})

const Hotel = new mongoose.model('Hotel', hotelSchema)

module.exports = Hotel