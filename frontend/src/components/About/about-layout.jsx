import { Fragment } from 'react';
import AboutHero from './about-hero';
import AboutOverview from './about-overview';
import AboutVision from './about-vision';
import AboutMission from './about-mission';
import AboutPillars from './about-pillars';

export default function AboutLayout({ sections }) {
  const contentSections = [
    { key: 'overview_section', Component: AboutOverview },
    { key: 'vision_section', Component: AboutVision },
    { key: 'mission_section', Component: AboutMission },
  ].filter(({ key }) => sections[key]);

  return (
    <div className="flex w-full min-w-0 flex-col bg-[#f4f3f1] [font-family:Inter,sans-serif] text-black [overflow-wrap:anywhere]">
      {sections.hero_section && <AboutHero section={sections.hero_section} />}

      {contentSections.length > 0 && (
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:space-y-12 sm:px-6 sm:py-16 lg:space-y-16 lg:px-12 lg:py-24">
          {contentSections.map(({ key, Component }, index) => (
            <Fragment key={key}>
              {index > 0 && (
                <div aria-hidden="true" className="flex items-center justify-center gap-4 py-4">
                  <div className="h-px flex-1 bg-[#d49520]/30" />
                  <span className="text-lg font-bold text-[#d49520]">★</span>
                  <div className="h-px flex-1 bg-[#d49520]/30" />
                </div>
              )}
              <Component section={sections[key]} />
            </Fragment>
          ))}
        </div>
      )}

      {(sections.core_values_section || sections.actions_section) && (
        <AboutPillars
          coreValues={sections.core_values_section}
          actions={sections.actions_section}
        />
      )}
    </div>
  );
}
