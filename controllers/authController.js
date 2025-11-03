const User = require('../models/User')
const generateToken = require('../utils/generateToken')
const sendgridService = require('../services/sendgridService')

// @desc    Register new user with email verification
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email and password'
      })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationCodeExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
      isVerified: false
    })

    const emailSent = await sendgridService.sendVerificationEmail(email, verificationCode)

    if (!emailSent) {
      await User.findByIdAndDelete(user._id)
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email. Please try again.'
      })
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      userId: user._id
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify email with code
// @route   POST /api/auth/verify
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and verification code'
      })
    }

    const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires')

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      })
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      })
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({
        success: false,
        error: 'Verification code expired. Please request a new one.'
      })
    }

    user.isVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpires = undefined
    await user.save()

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Resend verification code
// @route   POST /api/auth/resend-code
// @access  Public
exports.resendCode = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email'
      })
    }

    const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires')

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.verificationCode = verificationCode
    user.verificationCodeExpires = Date.now() + 10 * 60 * 1000
    await user.save()

    const emailSent = await sendgridService.sendVerificationEmail(email, verificationCode)

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sign in user
// @route   POST /api/auth/signin
// @access  Public
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: 'Please verify your email first'
      })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Sign out user (client-side token removal)
// @route   POST /api/auth/signout
// @access  Private
exports.signout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Signed out successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body

    const user = await User.findById(req.user.id)

    if (name) user.name = name

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password'
      })
    }

    const user = await User.findById(req.user.id).select('+password')

    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      })
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Send verification code (for already registered users)
// @route   POST /api/auth/send-code
// @access  Public
exports.sendVerificationCode = async (req, res, next) => {
  try {
    const { email, code } = req.body

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email and code are required'
      })
    }

    const emailSent = await sendgridService.sendVerificationEmail(email, code)

    if (emailSent) {
      return res.status(200).json({
        success: true,
        message: 'Verification code sent successfully'
      })
    } else {
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      })
    }
  } catch (error) {
    next(error)
  }
}