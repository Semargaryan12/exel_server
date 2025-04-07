const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helpers
const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
const register = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, surname, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = createAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Token expired or invalid', error: error.message });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};

const saveQuizAnswers = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let correctCount = 0;
    const evaluatedAnswers = answers.map((answer, index) => {
      const isCorrect = quiz.questions[index].correctAnswerIndex === answer.selectedOptionIndex;
      if (isCorrect) correctCount++;
      return { questionIndex: index, selectedOption: quiz.questions[index].options[answer.selectedOptionIndex], isCorrect };
    });

    const score = (correctCount / quiz.questions.length) * 100;

    const user = await User.findById(req.user._id);
    user.quizResults.push({ quizId, answers: evaluatedAnswers, score });
    await user.save();

    res.status(201).json({ message: "Quiz results saved", score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, refreshToken, logout, saveQuizAnswers };
