import Header from '../../layout/Header.jsx'
import Footer from '../../layout/Footer.jsx'
import HomeHero from '../../components/Home/HomeHero.jsx'
import { AboutSection, EventsSection, AwardsSection, ProjectsSection, TrainingSection } from '../../components/Home/HomeSections.jsx'
import useHome from '../../hooks/Home/useHome.js'
import { navigation } from '../../config/shared/site.js'
import './Home.css'

export default function HomePage() {
  const home = useHome()

  return <>
    <a className="skip-link" href="#noi-dung" onClick={home.skipToContent}>Chuyển đến nội dung</a>
    <main id="noi-dung" className="home-main" tabIndex={-1}>
      <HomeHero onNavigate={home.selectSection} />
      <AboutSection />
      <EventsSection />
      <AwardsSection />
      <ProjectsSection />
      <TrainingSection />
    </main>
    <Footer onNavigate={home.selectSection} />
  </>
}
