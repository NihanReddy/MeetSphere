import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import VideoMeetingView from './components/VideoMeetingView';
import ChannelsView from './components/ChannelsView';
import DocumentsView from './components/DocumentsView';
import ActivityView from './components/ActivityView';
import SettingsModal from './components/SettingsModal';
import NewMeetingModal from './components/NewMeetingModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize dark/light theme class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Launch video call for a meeting
  const handleJoinMeeting = (meeting) => {
    setActiveMeeting(meeting);
  };

  const handleStartInstantMeeting = () => {
    setActiveMeeting({
      id: `instant-${Date.now()}`,
      title: 'Instant Enterprise Sync',
      dateMonth: 'OCT',
      dateDay: '24',
      time: 'Live',
      location: 'Virtual Lobby Instant',
      host: 'Alex Chen'
    });
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-300">
      {/* FULLSCREEN VIDEO MEETING MODE */}
      {activeMeeting ? (
        <VideoMeetingView
          meeting={activeMeeting}
          onLeaveMeeting={() => setActiveMeeting(null)}
        />
      ) : (
        <>
          {/* SIDEBAR NAVIGATION */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'settings') {
                setIsSettingsOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
          />

          {/* TOP APP BAR HEADER */}
          <Header
            isCollapsed={isCollapsed}
            theme={theme}
            setTheme={setTheme}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onStartInstantMeeting={handleStartInstantMeeting}
            onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
          />

          {/* MAIN CONTAINER */}
          <main
            className={`flex-1 pt-24 pb-12 px-6 md:px-10 transition-all duration-300 max-w-7xl mx-auto w-full ${
              isCollapsed ? 'ml-20 w-[calc(100%-5rem)]' : 'ml-64 w-[calc(100%-16rem)]'
            }`}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                onJoinMeeting={handleJoinMeeting}
                onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'meetings' && (
              <DashboardView
                onJoinMeeting={handleJoinMeeting}
                onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'channels' && (
              <ChannelsView onJoinMeeting={handleJoinMeeting} />
            )}

            {activeTab === 'documents' && <DocumentsView />}

            {activeTab === 'activity' && <ActivityView />}
          </main>
        </>
      )}

      {/* MODALS */}
      <NewMeetingModal
        isOpen={isNewMeetingOpen}
        onClose={() => setIsNewMeetingOpen(false)}
        onStartMeeting={(meeting) => {
          setIsNewMeetingOpen(false);
          handleJoinMeeting(meeting);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
