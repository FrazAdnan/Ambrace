import React, { useState, useCallback } from 'react';
import Landing from './pages/Landing';
import StudentLobby from './pages/StudentLobby';
import TeacherDashboard from './pages/TeacherDashboard';
import ChatRoom from './pages/ChatRoom';
import SessionEnd from './pages/SessionEnd';
import ComingSoon from './pages/ComingSoon';
import Careers from './pages/Careers';
import Loyalty from './pages/Loyalty';
import GeminiBot from './components/GeminiBot';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [page, setPage] = useState('landing');
  const [role, setRole] = useState(null);
  const [matchData, setMatchData] = useState(null);   // { roomId, partner, subject, initiator }
  const [sessionData, setSessionData] = useState(null); // { duration, subject, partnerName }

  const handleSelectRole = useCallback((r) => {
    setRole(r);
    setPage(r === 'student' ? 'student-lobby' : 'teacher-dashboard');
  }, []);

  const handleMatched = useCallback((data) => {
    setMatchData(data);
    setPage('chat-room');
  }, []);

  const handleSessionEnd = useCallback((data) => {
    setSessionData({ ...data, partnerName: matchData?.partner?.name });
    setMatchData(null);
    setPage('session-end');
  }, [matchData]);

  const handleRestart = useCallback(() => {
    setPage(role === 'student' ? 'student-lobby' : 'teacher-dashboard');
    setSessionData(null);
    setMatchData(null);
  }, [role]);

  const handleBack = useCallback(() => {
    setPage('landing');
    setRole(null);
  }, []);

  const handleLaunchApp = useCallback(() => {
    setPage('coming-soon');
  }, []);

  const handleExploreCareers = useCallback(() => {
    setPage('careers');
  }, []);

  const handleExploreRewards = useCallback(() => {
    setPage('loyalty');
  }, []);

  return (
    <>
      {page === 'landing' && <Landing onSelectRole={handleSelectRole} onLaunchApp={handleLaunchApp} onExploreCareers={handleExploreCareers} onExploreRewards={handleExploreRewards} onHome={handleBack} />}
      {page === 'coming-soon' && <ComingSoon onBack={handleBack} />}
      {page === 'careers' && <Careers onBack={handleBack} onLaunchApp={handleLaunchApp} />}
      {page === 'loyalty' && <Loyalty onSelectRole={handleSelectRole} onExploreCareers={handleExploreCareers} onExploreRewards={handleExploreRewards} onBack={handleBack} onLaunchApp={handleLaunchApp} />}
      {page === 'student-lobby' && <StudentLobby onMatched={handleMatched} onBack={handleBack} />}
      {page === 'teacher-dashboard' && <TeacherDashboard onMatched={handleMatched} onBack={handleBack} />}
      {page === 'chat-room' && matchData && (
        <ChatRoom
          roomId={matchData.roomId}
          isInitiator={matchData.initiator}
          partner={matchData.partner}
          subject={matchData.subject}
          userName={matchData.partner?.name}
          onSessionEnd={handleSessionEnd}
        />
      )}
      {page === 'session-end' && <SessionEnd sessionData={sessionData} onRestart={handleRestart} onHome={handleBack} />}
      
      {/* Global AI Chatbot */}
      <GeminiBot />

      {/* Global Theme Toggle */}
      <ThemeToggle />
    </>
  );
}
