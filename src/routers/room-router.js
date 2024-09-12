const express = require('express')
const Room = require('../models/room-model')
const Hotel = require('../models/hotel-model')
const { adminAuth } = require('../middleware/auth')

const router = new express.Router()

// Router for creating a new room in a hotel
router.post('/rooms/:id', adminAuth, async (req, res) => {
    const hotel = req.params.id
    const room = new Room(req.body)

    try {
        const savedRoom = await room.save()
        await Hotel.findByIdAndUpdate(hotel, {$push: { rooms: savedRoom._id }})
        res.status(201).send(savedRoom)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Route handler for fetching hotels
router.get('/rooms/read', async (req, res) => {

    try {
        const rooms = await Room.find()
        res.status(200).send(rooms)
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for updating a hotel information
router.patch('/rooms/:id', adminAuth, async (req, res) => {

    const id = req.params.id

    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'pricePerNight', 'description', 'capacity', 'roomNumbers']
    const isValid = updates.every((update) => validUpdates.includes(update))

    if (!isValid) {
        res.send({ error: 'Invalid Updates!' })
    }

    try {
        const room = await Room.findByIdAndUpdate(id, req.body, { new: true })

        if (!room) {
            res.status(404).send()
        }

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for deleting a hotel from the database
router.delete('/rooms/:id', adminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})


module.exports = router