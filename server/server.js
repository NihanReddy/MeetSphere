import express from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { generateLiveKitToken } from './config/livekit.js';
import { initSignalingServer } from './sockets/signaling.js';
import meetingRoutes from './routes/meetingRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// CORS setup matching VITE frontend client server ports
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Mount Meeting Routes
app.use('/api/meetings', meetingRoutes);

// Mount Auth Routes
app.use('/api/auth', authRoutes);

// Main Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      server: 'UP',
      database: mongooseConnectionState(),
      cache: 'STUB'
    }
  });
});

// Endpoint: Generate LiveKit Authorization Token
app.post('/api/meetings/token', (req, res) => {
  const { roomName, identity, userMetadata } = req.body;

  if (!roomName || !identity) {
    return res.status(400).json({ error: 'roomName and identity are required parameters' });
  }

  try {
    const token = generateLiveKitToken(roomName, identity, { metadata: userMetadata });
    res.json({ token, roomName, identity });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Helper for Mongo connection status mapping
function mongooseConnectionState() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const states = ['DISCONNECTED', 'CONNECTED', 'CONNECTING', 'DISCONNECTING'];
  try {
    return states[mongoose.connection.readyState] || 'UNKNOWN';
  } catch {
    return 'NOT_INITIALIZED';
  }
}

// Websocket upgrade logic for signaling
const signalingServer = initSignalingServer(server);

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  
  if (pathname === '/signaling') {
    signalingServer.handleUpgrade(request, socket, head);
  } else {
    socket.destroy();
  }
});

// Startup Server initialization
async function startServer() {
  console.log('[System] Initializing backend services...');
  
  // Database connection
  await connectDB();
  
  // Caching connection stub
  await connectRedis();

  server.listen(PORT, () => {
    console.log(`=== Nexus Enterprise Workspace Service Active on Port ${PORT} ===`);
    console.log(`- API endpoints available at: http://localhost:${PORT}`);
    console.log(`- WS signaling server available at: ws://localhost:${PORT}/signaling`);
  });
}

startServer();
export default app;
