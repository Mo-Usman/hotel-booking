const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, 'hotelapitoken', (user, error) => {
            if (error) {
                throw new Error()
            } else {
                req.user = user
                req.token = token
            }
        })
        //const user = await User.findOne({ _id: decoded._id, 'tokens.token': token || })

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate!', e })
    }
}

const auth = (req, res, next) => {
    verifyToken(req, res, next, async () => {
        const user = await User.findOne({ _id: req.user._id, 'tokens.token': req.token || req.user.isAdmin })
        if (!user) {
            throw new Error()
        }

        next()
    })
}

const adminAuth = (req, res, next) => {
    auth(req, res, next, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            throw new Error()
        }
    })
}

module.exports = { adminAuth, auth }