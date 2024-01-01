const express = require('express');
const http = require('http');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
require('dotenv').config();
const User = require('./model/User');
const path = require('path');
const auth = require('./public/js/auth');
const app = express();


connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(__dirname + '/public'));
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/views/login.html');
});

// New route for the sign-in page
app.get('/sign-in', (request, response) => {
    response.sendFile(__dirname + '/views/sign-in.html');
});

app.get('/gallery', (request, response) => {
    response.sendFile(__dirname + '/views/main.html');
});


app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(401).json({ success: false, message: 'Username already exists' });
        }

        // Create a new user
        const newUser = new User({ username, password });

        // Save the user to the database
        await newUser.save();
        return res.status(401).json({ success: true, message: 'Succesfully Signed Up' })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.use(express.json());
app.post('/login', async (req, res) => {
    
    const { username, password } = req.body;
    
    try {
        // Find the user by username
        console.log("HITTT INSIDE login endpoint")
        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        // Check if the entered password matches the stored password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        //console.log(user);
        auth.login(user);
        console.log(auth.getCurrentUser);
        return res.status(401).json({ success: true, message: 'Succesfully Logged In' })
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await fetchUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


async function fetchUsers() {
    try {
        const users = await User.find({}, 'username');
        return users.map(user => ({
            username: user.username,
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}


const isAdmin = (req, res, next) => {
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.isAdmin) {
        next();
    } else {
        res.redirect('/gallery');
    }
};

app.get('/admin', isAdmin, (request, response) => {
    response.sendFile(__dirname + '/views/admin.html');
});

const isAdminCheck = (req, res, next) => {
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.isAdmin) {
        res.json({ isAdmin: true });
    } else {
        res.json({ isAdmin: false });
    }
};

app.get('/isAdmin', isAdminCheck);



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log(`http://localhost:3000`)
});
