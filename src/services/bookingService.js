import api from './api'

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/booking/create', bookingData)
    return response.data.success
  } catch (error) {
    console.error('Create booking error:', error)
    return false
  }
}