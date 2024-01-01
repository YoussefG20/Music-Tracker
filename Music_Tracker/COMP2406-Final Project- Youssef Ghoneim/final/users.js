const mongoose = require("mongoose")

const Schema = mongoose.Schema

const usersSchema = new Schema({
    username:{
        type:String,
        required: true 
    },
    password:{
        type:String,
        required: true
    },
    type: {
        type:String,
        required: true
    }
})

usersSchema.index({ username: 1 }, { unique: true }); 
module.exports = mongoose.model('User',usersSchema)