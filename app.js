const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connecDB = require('./config/db');
const authRoutes  = require('./routes/auth.routes');
const quizRoutes  = require('./routes/quiz.routes');
const client_URL = process.env.client_URL;

dotenv.config();

connecDB();

const app = express();

//Middleware
app.use(cors({
    origin: client_URL,
    methods: 'GET, POST, DELETE, PUT',
    credentials: true, 
}));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

module.exports = app;
