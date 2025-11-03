import { useRef, useState, useEffect } from 'react'

function VideoPlayer({ video }) {
  const videoRef = useRef(null)
  const wrapperRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setPlaying(true)
      } else {
        videoRef.current.pause()
        setPlaying(false)
      }
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play()
            setPlaying(true)
          } else {
            videoRef.current?.pause()
            setPlaying(false)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current)
    }

    return () => {
      if (wrapperRef.current) {
        observer.unobserve(wrapperRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={wrapperRef}
      className={`service-video-wrapper ${playing ? 'playing' : ''}`}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        className="service-video"
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="video-overlay">
        <button className="video-play-btn" type="button" aria-label="Play video">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>

      <button 
        className={`video-sound-btn ${muted ? 'muted' : ''}`}
        onClick={toggleMute}
        type="button"
        aria-label="Toggle sound"
      >
        <svg className="sound-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 5L6 9H2v6h4l5 4V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg className="sound-off" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default VideoPlayer