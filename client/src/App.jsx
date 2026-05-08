import React, { useState, useCallback } from 'react';
import Landing from './pages/Landing';
import StudentLobby from './pages/StudentLobby';
import TeacherDashboard from './pages/TeacherDashboard';
import ChatRoom from './pages/ChatRoom';
import SessionEnd from './pages/SessionEnd';

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

  return (
    <>
      {page === 'landing' && <Landing onSelectRole={handleSelectRole} />}
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
    </>
  );
}
