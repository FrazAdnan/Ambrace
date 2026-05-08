import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, cb) => cb(null, true), // Allow all in dev; restrict via CLIENT_URL below
    methods: ['GET', 'POST'],
  },
});

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174']
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ─── In-Memory State ─────────────────────────────────────────────────────────
const teachers = new Map();     // socketId → { name, subjects, status: 'available'|'busy' }
const studentQueue = [];        // [{ socketId, name, subject, timestamp }]
const rooms = new Map();        // roomId → { studentId, teacherId, subject, startTime }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getStats() {
  return {
    teachers: teachers.size,
    availableTeachers: [...teachers.values()].filter(t => t.status === 'available').length,
    studentsWaiting: studentQueue.length,
    activeSessions: rooms.size,
  };
}

function broadcastStats() {
  io.emit('server:stats', getStats());
}

function tryMatch(studentSocketId) {
  const student = studentQueue.find(s => s.socketId === studentSocketId);
  if (!student) return;

  for (const [teacherSocketId, teacher] of teachers) {
    if (
      teacher.status === 'available' &&
      teacher.subjects.some(s => s === student.subject)
    ) {
      const roomId = uuidv4();

      // Remove from queue
      const idx = studentQueue.findIndex(s => s.socketId === studentSocketId);
      if (idx !== -1) studentQueue.splice(idx, 1);

      // Mark teacher busy
      teacher.status = 'in-request';

      // Create room record (pending acceptance)
      rooms.set(roomId, {
        studentId: studentSocketId,
        teacherId: teacherSocketId,
        subject: student.subject,
        startTime: null,
        status: 'pending',
      });

      // Notify both parties
      io.to(studentSocketId).emit('match:found', {
        roomId,
        partner: { name: teacher.name, role: 'teacher' },
        subject: student.subject,
      });

      io.to(teacherSocketId).emit('match:request', {
        roomId,
        partner: { name: student.name, role: 'student' },
        subject: student.subject,
      });

      console.log(`[MATCH] ${student.name} ↔ ${teacher.name} | Subject: ${student.subject} | Room: ${roomId}`);
      broadcastStats();
      return;
    }
  }

  // No teacher found yet — update queue position
  const pos = studentQueue.findIndex(s => s.socketId === studentSocketId) + 1;
  io.to(studentSocketId).emit('queue:position', { position: pos });
}

// ─── Socket Events ────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);
  socket.emit('server:stats', getStats());

  // ── Teacher: Go Online ──────────────────────────────────────────────────
  socket.on('teacher:online', ({ name, subjects }) => {
    teachers.set(socket.id, { name, subjects, status: 'available' });
    console.log(`[TEACHER ONLINE] ${name} | Subjects: ${subjects.join(', ')}`);

    // Try to match waiting students
    const matched = new Set();
    for (const student of [...studentQueue]) {
      if (matched.has(socket.id)) break;
      const teacher = teachers.get(socket.id);
      if (teacher?.status === 'available' && teacher.subjects.includes(student.subject)) {
        tryMatch(student.socketId);
        matched.add(socket.id);
      }
    }
    broadcastStats();
  });

  // ── Teacher: Update Subjects ────────────────────────────────────────────
  socket.on('teacher:update', ({ subjects }) => {
    const teacher = teachers.get(socket.id);
    if (teacher) {
      teacher.subjects = subjects;
      broadcastStats();
    }
  });

  // ── Teacher: Go Offline ─────────────────────────────────────────────────
  socket.on('teacher:offline', () => {
    teachers.delete(socket.id);
    broadcastStats();
  });

  // ── Student: Join Queue ─────────────────────────────────────────────────
  socket.on('student:queue', ({ name, subject }) => {
    if (!studentQueue.find(s => s.socketId === socket.id)) {
      studentQueue.push({ socketId: socket.id, name, subject, timestamp: Date.now() });
    }
    broadcastStats();
    tryMatch(socket.id);
  });

  // ── Student: Leave Queue ────────────────────────────────────────────────
  socket.on('student:dequeue', () => {
    const idx = studentQueue.findIndex(s => s.socketId === socket.id);
    if (idx !== -1) studentQueue.splice(idx, 1);
    broadcastStats();
  });

  // ── Teacher: Accept Match ───────────────────────────────────────────────
  socket.on('match:accept', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    room.status = 'active';
    room.startTime = Date.now();

    const teacher = teachers.get(socket.id);
    if (teacher) teacher.status = 'busy';

    // Join socket.io room
    socket.join(roomId);
    const studentSocket = io.sockets.sockets.get(room.studentId);
    studentSocket?.join(roomId);

    // Student is initiator (creates offer)
    io.to(room.studentId).emit('match:accepted', { roomId, initiator: true });
    io.to(room.teacherId).emit('match:accepted', { roomId, initiator: false });

    console.log(`[SESSION START] Room: ${roomId}`);
    broadcastStats();
  });

  // ── Teacher: Decline Match ──────────────────────────────────────────────
  socket.on('match:decline', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    rooms.delete(roomId);

    const teacher = teachers.get(socket.id);
    if (teacher) teacher.status = 'available';

    // Put student back in queue
    io.to(room.studentId).emit('match:declined', {});
    console.log(`[MATCH DECLINED] Room: ${roomId}`);
    broadcastStats();
  });

  // ── WebRTC: Offer ───────────────────────────────────────────────────────
  socket.on('webrtc:offer', ({ roomId, offer }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const targetId = socket.id === room.studentId ? room.teacherId : room.studentId;
    io.to(targetId).emit('webrtc:offer', { offer });
  });

  // ── WebRTC: Answer ──────────────────────────────────────────────────────
  socket.on('webrtc:answer', ({ roomId, answer }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const targetId = socket.id === room.studentId ? room.teacherId : room.studentId;
    io.to(targetId).emit('webrtc:answer', { answer });
  });

  // ── WebRTC: ICE Candidate ───────────────────────────────────────────────
  socket.on('webrtc:ice-candidate', ({ roomId, candidate }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const targetId = socket.id === room.studentId ? room.teacherId : room.studentId;
    io.to(targetId).emit('webrtc:ice-candidate', { candidate });
  });

  // ── Chat Message ────────────────────────────────────────────────────────
  socket.on('chat:message', ({ roomId, message, senderName }) => {
    const room = rooms.get(roomId);
    if (!room) return;
    io.to(roomId).emit('chat:message', {
      message,
      senderName,
      senderId: socket.id,
      timestamp: Date.now(),
    });
  });

  // ── End Session ─────────────────────────────────────────────────────────
  socket.on('session:end', ({ roomId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const duration = room.startTime ? Math.floor((Date.now() - room.startTime) / 1000) : 0;

    io.to(roomId).emit('session:ended', { duration, subject: room.subject });

    // Cleanup
    const teacher = teachers.get(room.teacherId);
    if (teacher) teacher.status = 'available';

    rooms.delete(roomId);
    console.log(`[SESSION END] Room: ${roomId} | Duration: ${duration}s`);
    broadcastStats();
  });

  // ── Disconnect ──────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] ${socket.id}`);

    const wasTeacher = teachers.has(socket.id);
    teachers.delete(socket.id);

    const qIdx = studentQueue.findIndex(s => s.socketId === socket.id);
    if (qIdx !== -1) studentQueue.splice(qIdx, 1);

    // Handle active/pending room
    for (const [roomId, room] of rooms) {
      if (room.studentId === socket.id || room.teacherId === socket.id) {
        const partnerId = room.studentId === socket.id ? room.teacherId : room.studentId;
        io.to(partnerId).emit('session:partner-disconnected', {});

        if (wasTeacher) {
          const teacher = teachers.get(room.teacherId);
          if (teacher) teacher.status = 'available';
        } else {
          // Restore teacher availability
          const teacher = teachers.get(room.teacherId);
          if (teacher) teacher.status = 'available';
        }

        rooms.delete(roomId);
        break;
      }
    }

    broadcastStats();
  });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ...getStats() }));

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🎓 EduConnect server running on http://localhost:${PORT}`);
});
