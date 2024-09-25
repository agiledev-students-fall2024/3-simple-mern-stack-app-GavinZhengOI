import { useEffect, useState } from 'react'
import axios from 'axios'
import './About.css'

const About = () => {
  const [aboutData, setAboutData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
        setAboutData(response.data)
      } catch (err) {
        setError('Failed to fetch about data')
      }
    }

    fetchAboutData()
  }, [])

  if (error) {
    return <p className="About-error">{error}</p>
  }

  if (!aboutData) {
    return <p>Loading...</p>
  }

  return (
    <div className="About">
      <h1>About Us</h1>
      <img src={aboutData.photoUrl} alt={aboutData.name} />
      {aboutData.bio.map((paragraph, index) => (
        <p key={index} style={{ marginBottom: '16px' }}>{paragraph}</p>
      ))}
    </div>
  )
}

export default About
