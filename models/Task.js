const mongoose = require('../connection');

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        require: true
    },
    description:{
        type:String,
        require: true
    },
    from:{
        type:String,
        require: true
    },
    to:{
        type:String,
        require: true
    },
    due:{
        type:String,
        require: true
    },
    status: {
        type: String,
        enum: ['todo', 'progress','done','pause'],
        require: true
      }
})

module.exports = mongoose.model('Task',taskSchema)