const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({

    question: String,

    selectedOption: String,

    correctAnswer: String,

    isCorrect: Boolean,

    timeTakenInSeconds: Number

});

const ResultSchema = new mongoose.Schema({

    name: String,
    age: Number,
    profession: String,
    experience: String,
    email: String,
    college: String,
    department: String,

    score: Number,

    total: Number,

    answers: [AnswerSchema],

    submittedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Result", ResultSchema);