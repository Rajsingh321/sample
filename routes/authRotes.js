const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController')
const { protect } = require('../middleware/auth')

// Auth Routes - Public
router.post('/auth/signup', authController.signup)
router.post('/auth/signin', authController.signin)
router.post('/auth/verify', authController.verifyEmail)
router.post('/auth/resend-code', authController.resendCode)
router.post('/auth/send-code', authController.sendVerificationCode)

// Auth Routes - Private (Protected)
router.get('/auth/me', protect, authController.getMe)
router.post('/auth/signout', protect, authController.signout)
router.put('/auth/update-profile', protect, authController.updateProfile)
router.put('/auth/change-password', protect, authController.changePassword)

// Booking Routes - Private (Protected)
router.post('/booking/create', protect, bookingController.createBooking)

module.exports = router