const express = require('express');
const { createQuiz, getAllQuizzes, deleteQuiz, solveQuiz } = require('../controllers/quiz.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/isAdmin')
const validateQuiz = require('../middlewares/validateQuiz');

const router = express.Router();

router.post('/create', authMiddleware, adminMiddleware, validateQuiz, createQuiz);

router.get('/all', getAllQuizzes);

router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteQuiz);

router.post('/solve/:id', authMiddleware, solveQuiz);

module.exports = router;
