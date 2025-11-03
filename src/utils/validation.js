export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isValidPhone = (phone) => {
  const re = /^[\d\s\+\-\(\)]+$/
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const isWeekend = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDay()
  return day === 0 || day === 6
}