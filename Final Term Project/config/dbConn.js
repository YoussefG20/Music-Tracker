const mongoose = require('mongoose');
const uri = "mongodb+srv://gajapriyanv:kllPZzQvSdmwzYKU@cluster0.8j4mwtb.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB