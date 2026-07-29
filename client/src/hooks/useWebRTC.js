import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to manage pure WebRTC PeerConnection stubs
 * @param {string} roomName Name of the active video room
 * @param {object} socket Socket connection instance for signaling
 */
export function useWebRTC(roomName, socket) {
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  useEffect(() => {
    console.log(`[WebRTC] Initializing connection logic for room: ${roomName}`);

    const initLocalMedia = async () => {
      try {
        // Request actual camera media (will be captured when device has permissions)
        console.log('[WebRTC] Requesting local camera and microphone stream...');
        // Standard WebRTC constraints stub
        // localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (err) {
        console.error('[WebRTC] Error accessing media devices:', err);
      }
    };

    initLocalMedia();

    return () => {
      // Clean up connections on unmount
      console.log('[WebRTC] Tearing down peer connections...');
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
    };
  }, [roomName, socket]);

  const createPeerConnection = (peerId) => {
    console.log(`[WebRTC] Creating RTCPeerConnection for peer: ${peerId}`);
    
    // Standard ICE Server Configuration placeholder
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`[WebRTC] ICE Candidate generated for ${peerId}`);
        // Send candidate via signaling socket:
        // socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, target: peerId }));
      }
    };

    pc.ontrack = (event) => {
      console.log(`[WebRTC] Remote stream track received from peer: ${peerId}`);
      setRemoteStreams(prev => ({
        ...prev,
        [peerId]: event.streams[0]
      }));
    };

    peerConnections.current[peerId] = pc;
    return pc;
  };

  return {
    localStream: localStream.current,
    remoteStreams,
    createPeerConnection
  };
}
