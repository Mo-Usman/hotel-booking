const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, 'hotelapitoken')
        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

        if(!user) {
            throw new Error()
        }
        
        req.user = user
        req.token = token

        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate!', e })
    }
} 

module.exports = auth