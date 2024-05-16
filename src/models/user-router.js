const mongoose = require('mongoose')
const validator = require('validator')

userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                if(!validator.isEmail(value)) {
                    throw new Error('Invalid Email')
                }
            }
        },
        password: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value) => {
                    if(value.length < 6) {
                        throw new Error('Password must be greater than 6 characters!')
                    }
                    else if(validator.contains('password')) {
                        throw new Error("Password must not contain the string 'password' ")
                    }
                }
            }
        }
    }
})

const User = new mongoose.model('User', userSchema)

module.exports = User

