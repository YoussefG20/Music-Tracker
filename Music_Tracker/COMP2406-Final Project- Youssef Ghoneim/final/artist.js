const mongoose = require("mongoose")

const Schema = mongoose.Schema

const artistSchema = new Schema({
    username:{
        type:String,
        required: true 
    },
    artist:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('Artist',artistSchema)