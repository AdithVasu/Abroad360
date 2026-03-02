import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as dotenv from 'dotenv';

// 1. Remove the .js extensions
import authRoutes from './routes/authRoutes';
import planRoutes from './routes/planRoutes';
import messageRoutes from './routes/messageRoutes';
import pool from './lib/db'; 

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

// 2. Socket.io setup remains identical
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});



// 3. REAL-TIME MESSAGING LOGIC
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room`);
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;

    try {
      // Save message to Neon Database using the Pool
      await pool.query(
        'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)',
        [senderId, receiverId, content]
      );

      // Emit to the specific receiver's room
      io.to(receiverId.toString()).emit('receive_message', {
        senderId,
        content,
        sent_at: new Date()
      });
    } catch (err) {
      console.error('Socket Message Error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 4. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Abroad360 Backend is Live!');
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});