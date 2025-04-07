const express = require('express');
const { register, login, saveQuizAnswers, logout, refreshToken  } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validation/authValidation');

const { validationResult } = require("express-validator");
const router = express.Router();

// Register route
router.post('/register', registerValidation, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, register);


// Login route
router.post('/login', loginValidation, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, login);

router.get('/refresh', refreshToken);
router.post('/logou', logout)

router.post('/quizzes/submit', saveQuizAnswers);

module.exports = router;