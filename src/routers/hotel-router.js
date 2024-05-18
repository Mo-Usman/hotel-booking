const express = require('express')
const Hotel = require('../models/hotel-model')

const router = new express.Router()

// Route handler for adding a hotel
router.post('/hotels', async (req, res) => {
    const hotel = new Hotel(req.body)

    try {
        await hotel.save()
        res.status(201).send(hotel)
    } catch (e) {
        res.status(400).send()
    }
})

// Route handler for fetching hotels
router.get('/hotels/read', async (req, res) => {

    try {
        const hotels = await Hotel.find()
        res.status(200).send(hotels)
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for updating a hotel information
router.patch('/hotels/:id', async (req, res) => {

    const id = req.params.id

    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'address']
    const isValid = updates.every((update) => validUpdates.includes(update))

    if (!isValid) {
        res.send({ error: 'Invalid Updates!' })
    }

    try {
        const hotel = await Hotel.findByIdAndUpdate(id, req.body)

        if (!hotel) {
            res.status(404).send()
        }

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Route handler for deleting a hotel from the database
router.delete('/hotels/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router