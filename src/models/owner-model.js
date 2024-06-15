const mongoose = require('mongoose')
const validator = require('validator')

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Please Enter a Valid Email!')
                }
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) {
                if (value.length < 6) {
                    throw new Error('Please Enter a Password With 6 Characters or More!')
                }
            }
        }
    }
})

const Owner = new mongoose.model('Owner', ownerSchema)

module.exports = Owner