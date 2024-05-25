const express = require('express')
const User = require('../models/user-model')
const auth = require('../middleware/auth')

const router = new express.Router()

// Route handler for inserting users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for logging users in using email and password
router.post('/users/login', async (req, res) => {

    const email = req.body.email
    const password = req.body.password

    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for logging out of a single sessions
router.post('/users/logout', auth, async (req, res) => {
   try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
    })

    await req.user.save()
    res.send()

   } catch (e) {
    res.status(500).send()
   }
})

// Route handler for logging out of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for fetching users
router.get('/users/readProfile', auth, async (req, res) => {
    res.send(req.user)
})

// Route handler for updating users
router.patch('/users/:id', async (req, res) => {

    const id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'email', 'password']
    const isValid = updates.every((update) => validUpdates.includes(update))

    if(!isValid) {
        res.status(400).send({ error: 'Invalid Updates!' })
    }

    
    try {
        const user = await User.findByIdAndUpdate(id, req.body)
        
        if(!user) {
            res.status(404).send()
        }

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for deleting a user using id
router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).send(user)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router