const mongoose = require("mongoose");

/* =====================================
   ANSWER SCHEMA
===================================== */

const AnswerSchema = new mongoose.Schema({

    question: String,

    selectedOption: String,

    correctAnswer: String,

    isCorrect: Boolean,

    timeTakenInSeconds: Number,

    skipReason: String

});

/* =====================================
   QUESTION ANALYSIS SCHEMA
===================================== */

const QuestionAnalysisSchema = new mongoose.Schema({

    questionIndex: Number,

    selected: String,

    correct: String,

    isCorrect: Boolean,

    timeSpent: Number,

    skipReason: String

});

/* =====================================
   RESULT SCHEMA
===================================== */

const ResultSchema = new mongoose.Schema({

    /* USER DETAILS */

    name: {
        type: String
    },

    gender: {
        type: String,
        default: ""
    },

    age: {
        type: Number
    },

    profession: {
        type: String
    },

    experience: {
        type: String
    },

    email: {
        type: String
    },

    college: {
        type: String
    },

    department: {
        type: String
    },

    /* BASIC SCORE */

    score: {
        type: Number,
        default: 0
    },

    totalQuestions: {
        type: Number,
        default: 10
    },

    correctAnswers: {
        type: Number,
        default: 0
    },

    wrongAnswers: {
        type: Number,
        default: 0
    },

    accuracy: {
        type: String,
        default: "0"
    },

    /* KPI */

    confidenceScore: {
        type: Number,
        default: 0
    },

    hesitationScore: {
        type: String,
        default: "0"
    },

    completionRate: {
        type: String,
        default: "0"
    },

    skippedByTimeout: {
        type: Number,
        default: 0
    },

    skippedWithTimeRemaining: {
        type: Number,
        default: 0
    },

    attemptedQuestions: {
        type: Number,
        default: 0
    },

    totalThinkingTime: {
        type: Number,
        default: 0
    },

    averageThinkingTime: {
        type: String,
        default: "0"
    },

    fastAnsweredQuestions: {
        type: Number,
        default: 0
    },

    slowAnsweredQuestions: {
        type: Number,
        default: 0
    },
    
    /* CLUSTER PERFORMANCE */

easyPerformance: {
    type: Number,
    default: 0
},

moderatePerformance: {
    type: Number,
    default: 0
},

hardPerformance: {
    type: Number,
    default: 0
},

    /* PERFORMANCE BAND */

    performanceBand: {
        type: String,
        default: "Average"
    },

    /* AI ANALYSIS */

    behaviorAnalysis: {
        type: String,
        default: ""
    },

    /* QUESTION ANALYSIS */

    questionAnalysis: [QuestionAnalysisSchema],

    /* ANSWERS */

    answers: [AnswerSchema],

    /* DATE */

    submittedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Result",
    ResultSchema
);