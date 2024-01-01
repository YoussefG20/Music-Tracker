const User = require('../model/User');

async function createUser(username, password) {
    try {
        const user = new User({ username, password });
        await user.save();
        console.log('User created successfully!');
        return 'User created successfully!';
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Internal Server Error');
    }
}

module.exports = {
    createUser,
};