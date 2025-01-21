const express = require('express');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Replace '*' with your frontend URL for better security
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for Express routes
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes(io));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
