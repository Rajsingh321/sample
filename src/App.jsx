import { AppProvider } from './context/AppContext'
import Header from './components/Header'
import Hero from './components/Hero'
import ServiceCard from './components/ServiceCard'
import Footer from './components/Footer'
import SignupModal from './components/SignupModal'
import BookingModal from './components/BookingModal'
import SuccessModal from './components/SuccessModal'

function App() {
  const services = [
    {
      id: 1,
      title: 'AI Content Generation',
      description: 'Create high-quality content at scale with our advanced language models',
      video: '/videos/video1.mp4'
    },
    {
      id: 2,
      title: 'Image Recognition',
      description: 'Analyze and classify images with unprecedented accuracy and speed',
      video: '/videos/video2.mp4'
    },
    {
      id: 3,
      title: 'Data Analytics',
      description: 'Extract insights from complex datasets with intelligent automation',
      video: '/videos/video3.mp4'
    },
    {
      id: 4,
      title: 'Voice Synthesis',
      description: 'Transform text into natural-sounding speech in multiple languages',
      video: '/videos/video4.mp4'
    },
    {
      id: 5,
      title: 'Predictive AI',
      description: 'Forecast trends and outcomes with machine learning models',
      video: '/videos/video5.mp4'
    }
  ]

  return (
    <AppProvider>
      <Header />
      <main className="main">
        <Hero />
        <section className="services">
          <div className="container">
            <div className="services-grid">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SignupModal />
      <BookingModal />
      <SuccessModal />
    </AppProvider>
  )
}

export default App