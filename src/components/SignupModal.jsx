import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { sendVerificationCode } from '../services/authService'
import { isValidEmail } from '../utils/validation'

function SignupModal() {
  const { modals, closeModal, signup, setVerificationCode, setCodeExpiry, verificationCode, codeExpiry } = useApp()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    code: ''
  })
  const [codeDisabled, setCodeDisabled] = useState(true)
  const [codeSent, setCodeSent] = useState(false)
  const [btnText, setBtnText] = useState('Get Code')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleGetCode = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    setBtnDisabled(true)
    setBtnText('Sending...')

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = Date.now() + (10 * 60 * 1000)
    
    setVerificationCode(code)
    setCodeExpiry(expiry)

    const success = await sendVerificationCode(formData.email, code)

    if (success) {
      setCodeDisabled(false)
      setSubmitDisabled(false)
      setCodeSent(true)
      setBtnText('Code Sent ✓')
      alert('Verification code sent! Check your email.')
      
      setTimeout(() => {
        setBtnDisabled(false)
        setBtnText('Resend Code')
      }, 30000)
    } else {
      alert('Failed to send verification code. Please try again.')
      setBtnDisabled(false)
      setBtnText('Get Code')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.code) {
      alert('Please fill all fields')
      return
    }

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    if (formData.code.length !== 6) {
      alert('Verification code must be 6 digits')
      return
    }

    if (Date.now() > codeExpiry) {
      alert('Verification code expired. Please request a new one.')
      return
    }

    if (formData.code !== verificationCode) {
      alert('Invalid verification code. Please try again.')
      return
    }

    signup(formData.name, formData.email)
    closeModal('signup')
    setFormData({ name: '', email: '', password: '', code: '' })
    setCodeDisabled(true)
    setSubmitDisabled(true)
    setCodeSent(false)
    setBtnText('Get Code')
    alert(`Welcome, ${formData.name}! You're all set.`)
  }

  if (!modals.signup) return null

  return (
    <div className={`modal-overlay ${modals.signup ? 'active' : ''}`} onClick={() => closeModal('signup')}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => closeModal('signup')}>&times;</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Create your account</h2>
          <p className="modal-subtitle">Join ShreeAI to access cutting-edge AI solutions</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="code">Verification Code</label>
            <div className="input-group">
              <input
                type="text"
                id="code"
                name="code"
                className="form-input"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={handleChange}
                maxLength="6"
                disabled={codeDisabled}
                required
              />
              <button type="button" className="btn-code" onClick={handleGetCode} disabled={btnDisabled}>
                {btnText}
              </button>
            </div>
            {codeSent && <p className="form-hint success">✓ Code sent! Check your email</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={submitDisabled}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupModal