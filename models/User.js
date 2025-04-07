const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  surname: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  refreshToken: { type: String },
  quizResults: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      answers: [
        {
          questionIndex: Number,
          selectedOption: String,
          isCorrect: Boolean,
        },
      ],
      score: Number,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
