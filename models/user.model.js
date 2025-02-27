const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userame: String,
    password: String,
    email:{type : String, unique : true},
    Image:{type : String, default :'avatar.png'},
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
   

},{ timestamps: true })
module.exports = mongoose.model('User', userSchema);