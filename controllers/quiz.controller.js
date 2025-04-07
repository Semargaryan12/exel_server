const quizService = require('../services/quizService');
const { successResponse, createdResponse, errorResponse } = require('../utils/responses');

const createQuiz = async (req, res) => {
    try {
        const quiz = await quizService.createQuiz(req.body, req.user.id);
        return createdResponse(res, "Quiz created successfully", quiz);
    } catch (err) {
        console.log(err);
        
        return errorResponse(res, err.message);
    }
};

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizService.getAllQuizzes();
        return successResponse(res, "Quizzes retrieved", quizzes);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const deleteQuiz = async (req, res) => {
    try {
        await quizService.deleteQuiz(req.params.id);
        return successResponse(res, "Quiz deleted successfully");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

const solveQuiz = async (req, res) => {
    try {
        const result = await quizService.solveQuiz(req.params.id, req.body.answers);
        
        if (!result) return errorResponse(res, "Quiz not found", 404);
        
        return successResponse(res, `You scored ${result.score}/${result.total}`, result);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};



module.exports = { createQuiz, getAllQuizzes, deleteQuiz, solveQuiz };
