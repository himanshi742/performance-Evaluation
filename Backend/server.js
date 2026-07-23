const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); 
const hrRoutes = require('./routes/hrRoutes');
const managerRoutes = require('./routes/managerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://performance-evaluation-dusky.vercel.app"
  ],
  credentials: true
})); // Allows your Vite app (port 5173) to communicate with this API
app.use(express.json()); // Parses incoming JSON requests

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// We will mount our specific routes here in the next step
app.use('/api/auth', authRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});