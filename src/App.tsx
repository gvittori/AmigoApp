/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LostDogReport, DogProfile, UserProfile } from './types/amigo';
import { MOCK_USERS, MOCK_DOGS, MOCK_REPORTS } from './data/mockData';
import { LoginScreen } from './components/LoginScreen';
import { AdminPanel } from './components/AdminPanel';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { MapView } from './components/MapView';
import { CommunityFeed } from './components/CommunityFeed';
import { CommunityView } from './components/CommunityView';
import { BusinessesView } from './components/BusinessesView';
import { ReportModal } from './components/ReportModal';
import { DogDetailModal } from './components/DogDetailModal';
import { AiRescueAssistant } from './components/AiRescueAssistant';
import { MyPetsView } from './components/MyPetsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<'map' | 'feed' | 'report' | 'mypets' | 'community' | 'businesses' | 'assistant'>('map');

  const [reports, setReports] = useState<LostDogReport[]>(MOCK_REPORTS);
  const [userDogs, setUserDogs] = useState<DogProfile[]>(MOCK_DOGS);

  const [selectedReport, setSelectedReport] = useState<LostDogReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [lastEmail, setLastEmail] = useState('asuarez@gmail.com');
  const [lastPassword, setLastPassword] = useState('Asuarez1');

  const handleLogin = (user: UserProfile, emailEntered?: string, passwordEntered?: string) => {
    if (emailEntered) setLastEmail(emailEntered);
    if (passwordEntered) setLastPassword(passwordEntered);
    setCurrentUser(user);
    setActiveTab('map');
  };

  const handleRegister = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAdminPanel(false);
  };

  // Admin user CRUD handlers
  const handleUpdateUser = (updated: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleCreateUser = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleAddReport = (newReport: LostDogReport) => {
    setReports((prev) => [newReport, ...prev]);
    setShowReportModal(false);
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, score: prev.score + 15 } : prev));
    }
    setActiveTab('feed');
  };

  const handleAddDog = (newDog: DogProfile) => {
    setUserDogs((prev) => [newDog, ...prev]);
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        users={users}
        initialEmail={lastEmail}
        initialPassword={lastPassword}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-amber-500 selection:text-white overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenProfile={() => setActiveTab('mypets')}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        onLogout={handleLogout}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full pb-20 md:pb-6 overflow-x-hidden">
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

        {activeTab === 'mypets' && (
          <MyPetsView
            currentUser={currentUser}
            userDogs={userDogs}
            onAddDog={handleAddDog}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView />
        )}

        {activeTab === 'businesses' && (
          <BusinessesView />
        )}

        {activeTab === 'assistant' && (
          <AiRescueAssistant />
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

      {/* Admin Panel Modal */}
      {showAdminPanel && currentUser.role === 'Admin' && (
        <AdminPanel
          users={users}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onCreateUser={handleCreateUser}
          onClose={() => setShowAdminPanel(false)}
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
