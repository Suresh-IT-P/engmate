const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const vocabularyRoutes = require('./routes/vocabularyRoutes');
const grammarRoutes = require('./routes/grammarRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const speakingRoutes = require('./routes/speakingRoutes');
const aiRoutes = require('./routes/aiRoutes');
const skillRoutes = require('./routes/skillRoutes');
const progressRoutes = require('./routes/progressRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const searchRoutes = require('./routes/searchRoutes');
const friendRoutes = require('./routes/friendRoutes');
const chatRoutes = require('./routes/chatRoutes');
const battleRoutes = require('./routes/battleRoutes');

const app = express();

// Security and utility middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'English Mate — AI English Bridge',
    environment: config.env,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/grammar', grammarRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/speaking', speakingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/battle', battleRoutes);

// Serve static frontend in production if built
const backendPublic = path.resolve(__dirname, '../public');
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

app.use(express.static(backendPublic));
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const publicIndex = path.join(backendPublic, 'index.html');
  const distIndex = path.join(frontendDist, 'index.html');

  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  } else if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  next();
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
