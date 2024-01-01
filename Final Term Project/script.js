const User = require('./model/User');

const createUser = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      
      
      // Create a new user instance
      const newUser = new User({ username, password });

      // Save the user to the database
      await newUser.save();

      console.log("HITT")

      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('confirm-password').value = '';

      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const signUpForm = document.querySelector('.signup-form');
  signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    createUser();
  });