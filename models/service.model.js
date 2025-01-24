const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    nameservice: String,
    title: String,
    desc: String,
    Image:{type : String, default :'avatar.png'},
    Imagesponsor:{type : String, default :'avatar.png'},
    tags:[String]
})
module.exports = mongoose.model('Service', serviceSchema);