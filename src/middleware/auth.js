const jwt = require('jsonwebtoken')
const User = require('../models/user-model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        const decodedToken = jwt.verify(token, 'hotelapiitoken')
        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

        if(!user) {
            throw new Error()
        }
        
        req.user = user
        req.token = token

        next()
    } catch (e) {
        res.send({ error: 'Please Authenticate!' })
    }
} 

module.exports = auth