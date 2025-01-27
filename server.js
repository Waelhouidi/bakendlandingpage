const express=require('express');
const cors=require('cors');
const app = express();
const session = require('express-session'); // Import express-session

require('./config/connect');
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 1 day)
    },
  }));

app.get('req',(req,res)=>{res.send('server work ')})
const userRoute = require('./routes/user.routes');
const roomRoute = require('./routes/rooms.routes');
const serviceRoute = require('./routes/service.routes');
const postRoute = require('./routes/publication.routes');
app.use('/users',userRoute);
app.use('/rooms',roomRoute);
app.use('/services',serviceRoute);
app.use('/publication',postRoute);
app.use('/images',express.static('./public'));

app.listen(5000,()=>{console.log('listening on port 5000')})