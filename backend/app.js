require('dotenv').config(); // Load variables from .env file

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cors = require('cors');

const { createClient } = require('@supabase/supabase-js');

var authenticationRoutes = require('./routes/authenticationRoutes');
var colourRoutes = require('./routes/colourRoutes');

var app = express();

// Supabase client setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/authentication', authenticationRoutes);
app.use('/api/colours', colourRoutes);

// Example route using Supabase
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('test_table').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err.message });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

module.exports = app;
