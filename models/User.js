const mongoose = require('../connection');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require: true
    },
    login:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    role: {
        type: String,
        require: true
      }
})

module.exports = mongoose.model('User',userSchema)