import { useEffect, useRef, useCallback, useState } from 'react';
import { getSocket } from './useSocket';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function useWebRTC({ roomId, isInitiator, onCallEnd }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidates = useRef([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const socket = getSocket();

  useEffect(() => {
    const interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('webrtc:ice-candidate', { roomId, candidate: e.candidate });
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        setRemoteConnected(true);
      }
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        onCallEnd?.();
      }
    };
    return pc;
  }, [roomId, socket, onCallEnd]);

  useEffect(() => {
    if (!roomId) return;
    let pc;

    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        pc = createPeerConnection();
        peerConnectionRef.current = pc;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc:offer', { roomId, offer });
        }
      } catch (err) {
        console.error('WebRTC setup error:', err);
      }
    }

    setup();

    const handleOffer = async ({ offer }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('webrtc:answer', { roomId, answer });
      for (const c of pendingCandidates.current)
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(c));
      pendingCandidates.current = [];
    };

    const handleAnswer = async ({ answer }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      for (const c of pendingCandidates.current)
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(c));
      pendingCandidates.current = [];
    };

    const handleCandidate = async ({ candidate }) => {
      if (!peerConnectionRef.current) return;
      if (peerConnectionRef.current.remoteDescription)
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      else pendingCandidates.current.push(candidate);
    };

    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleCandidate);

    return () => {
      socket.off('webrtc:offer', handleOffer);
      socket.off('webrtc:answer', handleAnswer);
      socket.off('webrtc:ice-candidate', handleCandidate);
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      peerConnectionRef.current?.close();
    };
  }, [roomId, isInitiator, createPeerConnection, socket]);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsMuted(m => !m);
  }, []);

  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsCameraOff(c => !c);
  }, []);

  const endCall = useCallback(() => {
    socket.emit('session:end', { roomId });
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    peerConnectionRef.current?.close();
    onCallEnd?.();
  }, [roomId, socket, onCallEnd]);

  return { localVideoRef, remoteVideoRef, isMuted, isCameraOff, remoteConnected, callDuration, toggleMute, toggleCamera, endCall };
}
