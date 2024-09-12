const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    pricePerNight: {
        type: Number,
        trim: true,
        default: 100
    },
    description: {
        type: String,
        trim: true
    },
    capacity: {
        type: Number,
        trim: true,
        default: 1
    },
    roomNumbers: [{
        number: Number
    }]
})



const Room = mongoose.model('Room', roomSchema)

module.exports = Room