const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session'); // Import express-session

require('./config/connect');
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from Angular app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies and credentials
}));
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 1 day)
    },
}));
app.use(cors({ origin: 'http://localhost:4200' }));

// Serve static files from ./public/uploads
app.use('/uploads', express.static('public/uploads'));
app.use('/uploads', (req, _res, next) => {
  console.log("Requested file:", req.url); // Logs the requested file path
  next();
}, express.static('./public/uploads'));

// Test route
app.get('/', (req, res) => {
    res.send('Server is working');
});

// Routes
const userRoute = require('./routes/user.routes');
const roomRoute = require('./routes/rooms.routes');
const serviceRoute = require('./routes/service.routes');
const postRoute = require('./routes/publication.routes');
app.use('/users', userRoute);
app.use('/rooms', roomRoute);
app.use('/services', serviceRoute);
app.use('/publication', postRoute);

// Start server
app.listen(5000, () => {
    console.log('Server is listening on port 5000');
});