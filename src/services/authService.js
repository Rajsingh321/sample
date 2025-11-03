import api from './api'

export const sendVerificationCode = async (email, code) => {
  try {
    const response = await api.post('/auth/send-code', { email, code })
    return response.data.success
  } catch (error) {
    console.error('Send verification code error:', error)
    return false
  }
}