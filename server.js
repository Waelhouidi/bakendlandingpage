const express=require('express');
const cors=require('cors');
const app = express();
require('./config/connect');
app.use(express.json());
app.use(cors());


app.get('req',(req,res)=>{res.send('server work ')})

app.listen(5000,()=>{console.log('listening on port 5000')})