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
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes(io));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

io.on('connection', (socket) => {
    console.log('New client connected ' + socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected ' + socket.id);
    });
});
