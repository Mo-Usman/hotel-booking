const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                if(!validator.isEmail(value)) {
                    throw new Error('Invalid Email')
                }
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
                // else if(validator.contains('password')) {
                //     throw new Error("Password must not contain the string 'password' ")
                // }
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    bookedHotels: [{
       bookedHotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
       }
    }]
})

// Function to send back public profile of the user
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password

    return userObject
}

// Function to generate authentication tokens
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString(), isAdmin: user.isAdmin }, 'hotelapitoken')

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}

// Function to log users in using email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('No users found with the matching email!')
    }
    const isMatch = password === user.password ? true : false

    if (!isMatch) {
        throw new Error('Incorrect Password!')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User

