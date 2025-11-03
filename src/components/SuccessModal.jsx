import { useApp } from '../context/AppContext'

function SuccessModal() {
  const { modals, closeModal } = useApp()

  if (!modals.success) return null

  return (
    <div className={`modal-overlay ${modals.success ? 'active' : ''}`} onClick={() => closeModal('success')}>
      <div className="modal modal-success" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="32" fill="#10B981"/>
            <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h2 className="modal-title">Booking Confirmed!</h2>
        <p className="modal-subtitle">
          Thank you for choosing ShreeAI. We've received your consultation request and will contact you shortly with meeting details.
        </p>
        
        <button className="btn-primary" onClick={() => closeModal('success')}>
          Done
        </button>
      </div>
    </div>
  )
}

export default SuccessModal