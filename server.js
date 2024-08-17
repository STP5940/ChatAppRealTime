const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');
const express = require('express');
const path = require('path');
const logger = require('morgan');
var cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Rate limiter maximum of 100 requests per 1 hour per IP address
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 400,
    message: 'Too many requests from this IP, please try again later.',
    skip: (req) => {
        const pathsToSkip = [
            '/sticker',                     // เก็บข้อมูล sticker
            '/api/socket',                  // web socket
        ];

        const filesToSkip = [
            '/sw.js'                        // Service Worker
        ];

        // Check if the request path starts with any of the pathsToSkip
        if (pathsToSkip.some(path => req.path.startsWith(path))) {
            return true;
        }

        // Check if the request path ends with any of the filesToSkip
        if (filesToSkip.some(file => req.path.endsWith(file))) {
            return true;
        }

        // Check if the request path ends with '.js'
        if (req.path.endsWith('.js')) {
            return true;
        }

        return false; // Allow all other requests
    }
});

// Apply CORS middleware
app.use(cors());

// Apply the rate limiter middleware to all requests
app.use(limiter);

// Middleware to get user IP address
app.use(requestIp.mw());

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type', 'X-access-token');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

const UserRouter = require('./routes/user.routes');
const SocketRouter = require('./routes/socket.routes');

app.use(logger('dev'));
// app.use(SocketRouter);
app.use('/api/user', UserRouter);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

SocketRouter(io); // Pass the io instance to the SocketRouter function

server.listen(3000, () => {
    console.log('🦊 Server is running on port http://localhost:3000');
});
