import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [userData, setUserData] = useState(null)
  const [verificationCode, setVerificationCode] = useState(null)
  const [codeExpiry, setCodeExpiry] = useState(null)
  
  const [modals, setModals] = useState({
    signup: false,
    booking: false,
    success: false
  })

  const openModal = (name) => {
    setModals(prev => ({ ...prev, [name]: true }))
  }

  const closeModal = (name) => {
    setModals(prev => ({ ...prev, [name]: false }))
  }

  const signup = (name, email) => {
    setUserData({ name, email })
    setIsSignedUp(true)
  }

  const logout = () => {
    setUserData(null)
    setIsSignedUp(false)
    setVerificationCode(null)
    setCodeExpiry(null)
  }

  const value = {
    isSignedUp,
    userData,
    verificationCode,
    codeExpiry,
    modals,
    openModal,
    closeModal,
    signup,
    logout,
    setVerificationCode,
    setCodeExpiry
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}