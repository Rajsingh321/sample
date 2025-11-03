const express = require('express')
const cors = require('cors')
require('dotenv').config()

const apiRoutes = require('./routes/api')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const { PORT } = require('./config/env')

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})