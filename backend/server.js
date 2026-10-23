import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: 'Library Management System API',
    version: '1.0.0',
    endpoints: '/api/books, /api/students, /api/borrows, /api/seats, /api/events, /api/staff, /api/resources, /api/websites'
  });
});

// Connect DB & start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
