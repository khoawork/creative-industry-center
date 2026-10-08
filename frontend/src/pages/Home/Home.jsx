import HomeHero from '../../components/Home/HomeHero.jsx'
import { AboutSection, EventsSection, AwardsSection, ProjectsSection, TrainingSection } from '../../components/Home/HomeSections.jsx'
import useHome from '../../hooks/Home/useHome.js'

export default function HomePage() {
  const home = useHome()

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:font-semibold"
        href="#noi-dung"
        onClick={home.skipToContent}
      >
        Chuyển đến nội dung
      </a>
      <main id="noi-dung" className="w-full bg-surface min-h-[calc(100vh-6rem)] text-on-surface antialiased outline-none" tabIndex={-1}>
        <div className="flex flex-col w-full">
          <HomeHero onNavigate={home.selectSection} />
          <AboutSection />
          <EventsSection />
          <AwardsSection />
          <ProjectsSection />
          <TrainingSection />
        </div>
      </main>
    </>
  )
}
