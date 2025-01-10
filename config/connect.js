const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pipi').then(() => {console.log('Connect');}).catch((err) => {console.log('Error', err);});