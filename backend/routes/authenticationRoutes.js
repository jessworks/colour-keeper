var express = require('express');
var router = express.Router();
const supabase = require('../supabaseClient'); // Import Supabase client
const bcrypt = require('bcryptjs');

// Example registration route
router.post('/register', (req, res) => {
  // Registration logic (e.g., save user to database)
  res.send('User registered');
});

// Example login route
router.post('/login', (req, res) => {
  // Login logic (e.g., validate user credentials)
  res.send('User logged in');
});

module.exports = router;
