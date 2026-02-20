const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// 3. Routes Configuration

// Auth Routes (Includes /me, /login, /register)
app.use('/api/auth', require('./routes/userAuthRoutes'));

// Club Routes
app.use('/api/clubs', require('./routes/clubRoutes'));

// Team Routes (Nested under clubs to support :clubId)
// This fixes the 404 error: /api/clubs/:clubId/teams
app.use('/api/clubs/:clubId/teams', require('./routes/teamRoutes'));

// Other Feature Routes
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/follow', require('./routes/followRoutes'));
app.use('/api/recruitment', require('./routes/recruitmentRoutes'));

// 4. Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Club Portal API is running' });
});

// 5. 404 Handler (Should be after routes)
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: `Route not found - ${req.originalUrl}` 
  });
});

// 6. Global Error Handling Middleware
// This catches the 500 errors and prevents the server from crashing
app.use((err, req, res, next) => {
  console.error('🔥 Server Error Stack:', err.stack);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Something went wrong on the server!',
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Teams endpoint ready at: http://localhost:${PORT}/api/clubs/:clubId/teams`);
});