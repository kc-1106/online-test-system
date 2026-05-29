const mongoose = require("mongoose");

// =========================
// ANSWER SCHEMA
// =========================

const AnswerSchema = new mongoose.Schema({

    question: String,

    selectedOption: String,

    correctAnswer: String,

    isCorrect: Boolean,

    timeTakenInSeconds: Number,

    skipReason: String

});

// =========================
// QUESTION ANALYSIS SCHEMA
// =========================

const QuestionAnalysisSchema = new mongoose.Schema({

    questionIndex: Number,

    selected: String,

    correct: String,

    isCorrect: Boolean,

    timeSpent: Number,

    skipReason: String

});

// =========================
// MAIN RESULT SCHEMA
// =========================

const ResultSchema = new mongoose.Schema({

    // =========================
    // USER DETAILS
    // =========================

    name: String,

    age: Number,

    profession: String,

    experience: String,

    email: String,

    college: String,

    department: String,

    // =========================
    // BASIC TEST RESULT
    // =========================

    score: Number,

    totalQuestions: Number,

    correctAnswers: Number,

    wrongAnswers: Number,

    accuracy: String,

    // =========================
    // KPI ANALYTICS
    // =========================

    confidenceScore: Number,

    hesitationScore: String,

    completionRate: String,

    skippedByTimeout: Number,

    skippedWithTimeRemaining: Number,

    attemptedQuestions: Number,

    totalThinkingTime: Number,

    averageThinkingTime: String,

    fastAnsweredQuestions: Number,

    slowAnsweredQuestions: Number,

    // =========================
    // AI ANALYSIS
    // =========================

    behaviorAnalysis: String,

    // =========================
    // QUESTION ANALYSIS
    // =========================

    questionAnalysis: [QuestionAnalysisSchema],

    // =========================
    // ANSWERS
    // =========================

    answers: [AnswerSchema],

    // =========================
    // DATE
    // =========================

    submittedAt: {

        type: Date,

        default: Date.now

    }

});

module.exports = mongoose.model(
    "Result",
    ResultSchema
);