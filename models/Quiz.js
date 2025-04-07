const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    questions: [
        {
            text: { type: String, required: true },
            options: {
                type: [String],
                required: true,
                validate: {
                    validator: function (v) {
                        return v.length >= 2;
                    },
                    message: "Each question must have at least two options."
                }
            },
            correctAnswerIndex: { 
                type: Number, 
                required: true, 
                validate: {
                    validator: function (value) {
                        return this.options && value >= 0 && value < this.options.length;
                    },
                    message: "Correct answer index must be within the options array."
                }
            }
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
