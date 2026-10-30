import React from 'react';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { QuickAccessServices } from '../components/home/QuickAccessServices';
import { UpcomingEventsPreview } from '../components/home/UpcomingEventsPreview';
import { LivePushkaraluPreview } from '../components/home/LivePushkaraluPreview';
import { MedicalPolicePreview } from '../components/home/MedicalPolicePreview';
import { HeritagePreviewSection } from '../components/home/HeritagePreviewSection';
import { AnnouncementsSection } from '../components/home/AnnouncementsSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Slideshow with Godavari imagery & actions */}
      <HeroSlideshow />

      {/* 2. Quick Access Services Cards */}
      <QuickAccessServices />

      {/* 3. Upcoming Events Preview (Demo) */}
      <UpcomingEventsPreview />

      {/* 4. Live Pushkaralu Preview (Demo streams) */}
      <LivePushkaraluPreview />

      {/* 5. Medical & Police Assistance Preview */}
      <MedicalPolicePreview />

      {/* 6. Heritage & Cultural Explorer Preview */}
      <HeritagePreviewSection />

      {/* 7. Important Announcements */}
      <AnnouncementsSection />
    </div>
  );
};
