const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session'); // Import express-session
const multer = require('multer');
const path = require('path');
const upload = require('./models/Middleware/upload'); // Adjust path if needed
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Load environment variables

require('./config/connect');
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from Angular app
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ['Content-Type', 'Authorization']

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

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));






  
// Test route
app.get('/', (req, res) => {
    res.send('Server is working');
});

// Routes
const userRoute = require('./routes/user.routes');
const serviceRoute = require('./routes/service.routes');
const postRoute = require('./routes/publication.routes');
const catagoryRoute = require('./routes/catagory.routes');
const commentsRoute = require('./routes/comments.routes');
const messagesRoute = require('./routes/message.routes');
const subscribeRoute = require('./routes/subscribe.routes');
app.use('/users', userRoute);
app.use('/services', serviceRoute);
app.use('/publication', postRoute);
app.use('/subscription', subscribeRoute);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded');
app.use('/catagory', catagoryRoute);
app.use('/api', commentsRoute);
app.use('/api/messages', messagesRoute);

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

});