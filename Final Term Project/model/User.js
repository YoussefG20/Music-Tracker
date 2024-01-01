const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.comparePassword = function(candidatePassword) {
    // Compare the candidatePassword with the stored password
    return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
