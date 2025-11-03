import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { createBooking } from '../services/bookingService'
import { isValidEmail, isValidPhone, isWeekend } from '../utils/validation'

function BookingModal() {
  const { modals, closeModal, openModal, userData } = useApp()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    country: '',
    date: '',
    time: '',
    services: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name,
        email: userData.email
      }))
    }
  }, [userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (e) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...prev.services, value]
        : prev.services.filter(s => s !== value)
    }))
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    if (date && !isWeekend(date)) {
      alert('⚠️ Please select Saturday or Sunday only')
      e.target.value = ''
      return
    }
    setFormData(prev => ({ ...prev, date }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.country || !formData.date || !formData.time) {
      alert('Please fill all required fields')
      return
    }

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    if (!isValidPhone(formData.phone)) {
      alert('Please enter a valid phone number')
      return
    }

    if (!isWeekend(formData.date)) {
      alert('Please select a weekend date (Saturday or Sunday)')
      return
    }

    if (formData.services.length === 0) {
      alert('Please select at least one service')
      return
    }

    setLoading(true)

    const bookingData = {
      ...formData,
      bookingId: 'SHREEAI-' + Date.now(),
      createdAt: new Date().toISOString()
    }

    const success = await createBooking(bookingData)

    setLoading(false)

    if (success) {
      closeModal('booking')
      openModal('success')
      setFormData({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: '',
        gender: '',
        country: '',
        date: '',
        time: '',
        services: []
      })
    } else {
      alert('❌ Booking failed. Please try again or contact support.')
    }
  }

  if (!modals.booking) return null

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={`modal-overlay ${modals.booking ? 'active' : ''}`} onClick={() => closeModal('booking')}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => closeModal('booking')}>&times;</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Book Your Consultation</h2>
          <p className="modal-subtitle">Schedule a meeting with our AI experts</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="bookingName">Full Name</label>
              <input
                type="text"
                id="bookingName"
                name="name"
                className="form-input"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bookingEmail">Email Address</label>
              <input
                type="email"
                id="bookingEmail"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="bookingPhone">Phone Number</label>
              <input
                type="tel"
                id="bookingPhone"
                name="phone"
                className="form-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bookingGender">Gender</label>
              <select
                id="bookingGender"
                name="gender"
                className="form-input"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bookingCountry">Country</label>
            <input
              type="text"
              id="bookingCountry"
              name="country"
              className="form-input"
              placeholder="Your country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="meetingDate">Preferred Date (Weekends only)</label>
              <input
                type="date"
                id="meetingDate"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleDateChange}
                min={today}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="meetingTime">Preferred Time</label>
              <select
                id="meetingTime"
                name="time"
                className="form-input"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">Select Time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="07:00 PM">07:00 PM</option>
                <option value="08:00 PM">08:00 PM</option>
                <option value="09:00 PM">09:00 PM</option>
                <option value="10:00 PM">10:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Services Interested In (Select at least one)</label>
            <div className="checkbox-grid">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value="AI Content Generation"
                  checked={formData.services.includes('AI Content Generation')}
                  onChange={handleServiceChange}
                />
                <span className="checkbox-label">AI Content Generation</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value="Image Recognition"
                  checked={formData.services.includes('Image Recognition')}
                  onChange={handleServiceChange}
                />
                <span className="checkbox-label">Image Recognition</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value="Data Analytics"
                  checked={formData.services.includes('Data Analytics')}
                  onChange={handleServiceChange}
                />
                <span className="checkbox-label">Data Analytics</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value="Voice Synthesis"
                  checked={formData.services.includes('Voice Synthesis')}
                  onChange={handleServiceChange}
                />
                <span className="checkbox-label">Voice Synthesis</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value="Predictive AI"
                  checked={formData.services.includes('Predictive AI')}
                  onChange={handleServiceChange}
                />
                <span className="checkbox-label">Predictive AI</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Book Consultation'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal