/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LostDogReport, DogProfile, UserProfile } from './types/amigo';
import { MOCK_USERS, MOCK_DOGS, MOCK_REPORTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MapView } from './components/MapView';
import { CommunityFeed } from './components/CommunityFeed';
import { ReportModal } from './components/ReportModal';
import { DogDetailModal } from './components/DogDetailModal';
import { AiRescueAssistant } from './components/AiRescueAssistant';
import { MyPetsView } from './components/MyPetsView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'feed' | 'report' | 'mypets' | 'assistant'>('map');

  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [reports, setReports] = useState<LostDogReport[]>(MOCK_REPORTS);
  const [userDogs, setUserDogs] = useState<DogProfile[]>(MOCK_DOGS);

  const [selectedReport, setSelectedReport] = useState<LostDogReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleAddReport = (newReport: LostDogReport) => {
    setReports((prev) => [newReport, ...prev]);
    setShowReportModal(false);
    setCurrentUser((prev) => ({ ...prev, score: prev.score + 15 }));
    setActiveTab('feed');
  };

  const handleAddDog = (newDog: DogProfile) => {
    setUserDogs((prev) => [newDog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-amber-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenProfile={() => setActiveTab('mypets')}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full">
        {activeTab === 'map' && (
          <MapView
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        )}

        {activeTab === 'feed' && (
          <CommunityFeed
            reports={reports}
            onSelectReport={(report) => setSelectedReport(report)}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AiRescueAssistant />
        )}

        {activeTab === 'mypets' && (
          <MyPetsView
            currentUser={currentUser}
            userDogs={userDogs}
            onAddDog={handleAddDog}
          />
        )}
      </main>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleAddReport}
          userDogs={userDogs}
          existingReports={reports}
        />
      )}

      {/* Dog Detail Modal */}
      {selectedReport && (
        <DogDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Mobile Touch-First Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'report') {
            setShowReportModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />
    </div>
  );
}
