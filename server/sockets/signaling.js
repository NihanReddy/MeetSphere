import { WebSocketServer } from 'ws';

/**
 * Initializes the WebSocket signaling server for WebRTC.
 * @param {object} server HTTP server instance
 */
export function initSignalingServer(server) {
  console.log('[WebRTC Signaling] Initializing WebSocket signaling server...');

  const wss = new WebSocketServer({ noServer: true });

  // Map to store active client connections by their session identity
  const clients = new Map();

  wss.on('connection', (ws, req) => {
    let clientIdentity = null;
    let activeRoom = null;

    console.log('[WebRTC Signaling] New connection established');

    ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message);
        console.log(`[WebRTC Signaling] Received action: ${payload.type}`);

        switch (payload.type) {
          case 'join':
            clientIdentity = payload.identity;
            activeRoom = payload.room;
            clients.set(clientIdentity, { ws, room: activeRoom });
            
            console.log(`[WebRTC Signaling] Client ${clientIdentity} joined room: ${activeRoom}`);
            
            // Broadcast user-joined to all other peers in the same room
            broadcastToRoom(activeRoom, clientIdentity, {
              type: 'peer-joined',
              peerId: clientIdentity
            });
            break;

          case 'offer':
          case 'answer':
          case 'candidate':
            // Route signaling message to target peer
            const targetClient = clients.get(payload.target);
            if (targetClient) {
              targetClient.ws.send(JSON.stringify({
                ...payload,
                sender: clientIdentity
              }));
            }
            break;

          default:
            console.warn(`[WebRTC Signaling] Unknown message type: ${payload.type}`);
        }
      } catch (err) {
        console.error('[WebRTC Signaling] Error processing message:', err.message);
      }
    });

    ws.on('close', () => {
      if (clientIdentity) {
        clients.delete(clientIdentity);
        console.log(`[WebRTC Signaling] Client disconnected: ${clientIdentity}`);
        
        // Notify others in room
        if (activeRoom) {
          broadcastToRoom(activeRoom, clientIdentity, {
            type: 'peer-left',
            peerId: clientIdentity
          });
        }
      }
    });
  });

  // Helper to send messages to all participants in a room (except sender)
  function broadcastToRoom(roomName, senderIdentity, data) {
    clients.forEach((client, identity) => {
      if (client.room === roomName && identity !== senderIdentity) {
        if (client.ws.readyState === 1) { // OPEN state
          client.ws.send(JSON.stringify(data));
        }
      }
    });
  }

  // Handle upgrade event from main server.js
  return {
    handleUpgrade: (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  };
}
