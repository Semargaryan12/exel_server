const Quiz = require('../models/Quiz');


const createQuiz = async (quizData, userId) => {
    const quiz = new Quiz({ ...quizData, createdBy: userId });
    return await quiz.save();
};


const getAllQuizzes = async () => {
    return await Quiz.find().populate("createdBy", "username");
};


const deleteQuiz = async (quizId) => {
    return await Quiz.findByIdAndDelete(quizId);
};


const solveQuiz = async (quizId, userAnswers) => {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return null;

    let score = 0;
  
    
    quiz.questions.forEach((q, index) => {
        
        console.log(q.correctAnswerIndex);
        const userAnswerIndex = userAnswers[index]?.selectedAnswerIndex;
        
        
        if (q.correctAnswerIndex === userAnswerIndex) {
            score++;
            
            
        }
    });

    return { score, total: quiz.questions.length };
};



module.exports = { createQuiz, getAllQuizzes, deleteQuiz, solveQuiz };
