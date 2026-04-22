const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic "Hello World" / Connectivity Test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the Node.js backend!', status: 'Connected' });
});

// Root route
app.get('/', (req, res) => {
  res.send('You Be The Champ API is running...');
});

// MongoDB Connection (Placeholder)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/youbethechamp';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected (placeholder)'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
