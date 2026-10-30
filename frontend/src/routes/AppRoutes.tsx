import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { ExploreGhatsPage } from '../pages/ExploreGhatsPage';
import { GhatDetailPage } from '../pages/GhatDetailPage';
import { TemplesPage } from '../pages/TemplesPage';
import { TempleDetailPage } from '../pages/TempleDetailPage';
import { ParkingPage } from '../pages/ParkingPage';
import { MapPage } from '../pages/MapPage';
import { NearbyFacilitiesPage } from '../pages/NearbyFacilitiesPage';
import { LivePushkaraluPage } from '../pages/LivePushkaraluPage';
import { LivePlayerPage } from '../pages/LivePlayerPage';
import { RecordingsPage } from '../pages/RecordingsPage';
import { MedicalAssistancePage } from '../pages/MedicalAssistancePage';
import { MedicalCampDetailPage } from '../pages/MedicalCampDetailPage';
import { PoliceAssistancePage } from '../pages/PoliceAssistancePage';
import { LostAndFoundPage } from '../pages/LostAndFoundPage';
import { ReportIncidentPage } from '../pages/ReportIncidentPage';
import { TrackReportPage } from '../pages/TrackReportPage';
import { HeritagePage } from '../pages/HeritagePage';
import { HeritageDetailPage } from '../pages/HeritageDetailPage';
import { HeritageStoryDetailPage } from '../pages/HeritageStoryDetailPage';
import { PlanYatraPage } from '../pages/PlanYatraPage';
import { CreateYatraPage } from '../pages/CreateYatraPage';
import { YatraDetailPage } from '../pages/YatraDetailPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/explore" element={<ExploreGhatsPage />} />
      <Route path="/explore/ghats" element={<ExploreGhatsPage />} />
      <Route path="/explore/map" element={<MapPage />} />
      <Route path="/explore/:id" element={<GhatDetailPage />} />
      <Route path="/temples" element={<TemplesPage />} />
      <Route path="/temples/:id" element={<TempleDetailPage />} />
      <Route path="/parking" element={<ParkingPage />} />
      <Route path="/nearby-facilities" element={<NearbyFacilitiesPage />} />
      <Route path="/live" element={<LivePushkaraluPage />} />
      <Route path="/live/recordings" element={<RecordingsPage />} />
      <Route path="/live/:streamId" element={<LivePlayerPage />} />

      {/* Phase 3 Routes */}
      <Route path="/medical-assistance" element={<MedicalAssistancePage />} />
      <Route path="/medical-assistance/camp/:id" element={<MedicalCampDetailPage />} />
      <Route path="/police-assistance" element={<PoliceAssistancePage />} />
      <Route path="/lost-and-found" element={<LostAndFoundPage />} />
      <Route path="/report-incident" element={<ReportIncidentPage />} />
      <Route path="/track-report" element={<TrackReportPage />} />

      {/* Phase 5 Routes – Heritage Explorer & Personal Yatra Planner */}
      <Route path="/heritage" element={<HeritagePage />} />
      <Route path="/heritage/stories/:slug" element={<HeritageStoryDetailPage />} />
      <Route path="/heritage/:slug" element={<HeritageDetailPage />} />
      <Route path="/yatra-planner" element={<PlanYatraPage />} />
      <Route path="/yatra-planner/create" element={<CreateYatraPage />} />
      <Route path="/yatra-planner/:id" element={<YatraDetailPage />} />
      <Route path="/plan-yatra" element={<Navigate to="/yatra-planner" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
