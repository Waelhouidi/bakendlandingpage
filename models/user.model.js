const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userame: String,
    password: String,
    email:{type : String, unique : true},
    Image:{type : String, default :'avatar.png'}
})
module.exports = mongoose.model('User', userSchema);