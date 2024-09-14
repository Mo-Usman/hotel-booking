const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.auth_token

        if (!token) {
            throw new Error('You are not authenticated!')
        }

        jwt.verify(token, 'hotelapitoken', (error, user) => {
            if (error) {
                throw new Error('Invalid token!')
            }
            req.user = user
            req.token = token
            next()
        })
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate!' })
    }

}

const auth = (req, res, next) => {
    verifyToken(req, res, next)
        if (req.user._id === req.params.id || req.user.isAdmin) {
            res.send(req.user.id)
            next()
        } else {
            throw new Error()
        }
}

const adminAuth = (req, res, next) => {
    auth(req, res, next)
        console.log(req.user.isAdmin)
        if (req.user.isAdmin === true) {
            next()
        } else {
            throw new Error()
        }
}

// Function to sign-up users
const signUp = async (req, res, next) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

// Function to log-in users
const login = async (req, res, next) => {

    const email = req.body.email
    const password = req.body.password

    try {
        const user = await User.findByCredentials(email, password)
        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, 'hotelapitoken')
        res.cookie('auth_token', token, { httpOnly: true }).status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports = { adminAuth, auth, signUp, login }