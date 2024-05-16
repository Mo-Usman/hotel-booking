const express = require('express')
require('./db/mongoose')

const app = express()

app.use(express.json)

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})