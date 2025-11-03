import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

function Header() {
  const { isSignedUp, userData, openModal } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <img src="/logo.png" alt="ShreeAI Logo" onError={(e) => e.target.style.display = 'none'} />
          <span className="logo-text">ShreeAI</span>
        </div>

        {!isSignedUp ? (
          <button className="btn-signup" onClick={() => openModal('signup')}>
            Sign up
          </button>
        ) : (
          <div className="profile-menu active">
            <div className="profile-btn">
              <div className="profile-avatar">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="profile-name">{userData?.name}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header