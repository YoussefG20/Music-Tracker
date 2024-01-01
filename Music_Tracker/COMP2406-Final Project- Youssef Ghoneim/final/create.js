const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://youssefg20:youssef2004@cluster0.elj2yxf.mongodb.net/userDB?retryWrites=true&w=majority",{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
    }catch(err){
        console.error(err)
    }
}

module.exports = connectDB

