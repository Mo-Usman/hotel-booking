const express = require('express')
const User = require('../models/user-model')
const auth = require('../middleware/auth')
const Hotel = require('../models/hotel-model')

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
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for booking a hotel
router.post('/users/bookHotel/:id', auth, async (req, res) => {
    const hotel = req.params.id
    const user = req.user

    try {
        user.bookedHotels = user.bookedHotels.concat({ hotel: hotel })
        await user.save()
        res.status(200).send(user)
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

// Route handler for fetching profile
router.get('/users/readProfile', auth, async (req, res) => {
    res.send(req.user)
})

// Route handler for updating users
router.patch('/users/updateProfile', auth, async (req, res) => {

    const id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'email', 'password']
    const isValid = updates.every((update) => validUpdates.includes(update))

    if(!isValid) {
        res.status(400).send({ error: 'Invalid Updates!' })
    }

    
    try {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for deleting a user using id
router.delete('/users/deleteProfile', auth, async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.user._id)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router