import { useApp } from '../context/AppContext'
import VideoPlayer from './VideoPlayer'

function ServiceCard({ service }) {
    const { isSignedUp, openModal } = useApp()

    const handleTryService = () => {
        if (!isSignedUp) {
            openModal('signup')
        } else {
            openModal('booking')
        }
    }

    return (
        <article className="service-card">
            <VideoPlayer video={service.video} />
            <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button className="btn-service" onClick={handleTryService}>
                    Try this Service
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </article>
    )
}

export default ServiceCard