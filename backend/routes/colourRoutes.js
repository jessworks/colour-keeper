var express = require('express');
var router = express.Router();
const supabase = require('../supabaseClient'); // Import Supabase client

// Example route for adding an art supply
router.post('/', (req, res) => {
  // Logic to add art supply
  res.send('Art supply added');
});

// Example route to fetch art supplies for a user
router.get('/:user_id', (req, res) => {
  // Logic to fetch art supplies for the user
  res.send('Art supplies fetched');
});

module.exports = router;