const express=require('express');
const cors=require('cors');
const app = express();
require('./config/connect');
app.use(express.json());
app.use(cors());


app.get('req',(req,res)=>{res.send('server work ')})
const userRoute = require('./routes/user.routes');
const roomRoute = require('./routes/rooms.routes');
const serviceRoute = require('./routes/service.routes');
const postRoute = require('./routes/publication.routes');
app.use('/users',userRoute);
app.use('/rooms',roomRoute);
app.use('/services',serviceRoute);
app.use('/publications',postRoute);
app.use('/images',express.static('./public'));

app.listen(5000,()=>{console.log('listening on port 5000')})