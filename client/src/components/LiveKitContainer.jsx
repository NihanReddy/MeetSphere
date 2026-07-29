import React, { useEffect, useState } from 'react';

/**
 * LiveKit Video Session Integration Component Stub
 * Showcases how to integrate LiveKit Room, Participant, and Track rendering.
 * 
 * Recommended live library imports:
 * import { LiveKitRoom, VideoConference } from '@livekit/components-react';
 * import '@livekit/components-styles';
 */
export default function LiveKitContainer({ token, roomName, onDisconnect }) {
  const [roomState, setRoomState] = useState('connecting'); // 'connecting' | 'connected' | 'disconnected'
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || 'wss://livekit.nexus.io';

  useEffect(() => {
    console.log(`[LiveKit] Connecting to LiveKit Server: Url=${serverUrl}, Token=${token.substring(0, 15)}...`);
    
    // Simulate connection lifecycle
    const timer1 = setTimeout(() => setRoomState('connected'), 1200);

    return () => {
      clearTimeout(timer1);
      console.log('[LiveKit] Cleanup: Leaving room session');
    };
  }, [token]);

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center py-12 relative overflow-hidden shadow-xl min-h-[300px]">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>

      {roomState === 'connecting' && (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h4 className="font-bold text-sm text-on-surface font-display">Negotiating Media Server Connection...</h4>
          <p className="text-xs text-on-surface-variant font-mono">Authenticating with token to {roomName}</p>
        </div>
      )}

      {roomState === 'connected' && (
        <div className="space-y-6 w-full max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-glow border border-emerald-500/30">
            ✓
          </div>
          <div>
            <h4 className="font-bold text-base text-on-surface font-display">Secure LiveKit Connection Active</h4>
            <p className="text-xs text-on-surface-variant font-mono mt-1">Room: {roomName} • Latency: &lt;18ms</p>
          </div>

          <div className="border border-outline-variant rounded-xl p-4 bg-surface-container-lowest text-xs text-left space-y-2 font-mono">
            <p className="text-primary font-bold">LiveKit SDK Initializer Template Code:</p>
            <pre className="text-[10px] text-on-surface-variant overflow-x-auto leading-relaxed bg-surface p-2.5 rounded-lg border border-outline-variant">
{`// LiveKit Integration Hook
import { useRoom, useTracks } from '@livekit/components-react';

export function ActiveRoom() {
  const { room } = useRoom();
  const tracks = useTracks([Track.Source.Camera]);
  
  return (
    <div className="grid grid-cols-2">
      {tracks.map(t => (
        <VideoTrack trackRef={t} />
      ))}
    </div>
  );
}`}
            </pre>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onDisconnect}
              className="px-5 py-2.5 bg-error text-white font-bold text-xs rounded-xl hover:bg-error/90 transition-all active:scale-95 shadow-md"
            >
              Disconnect Server Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
