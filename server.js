const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

mongoose.connect(
    "mongodb+srv://2503717624322301_db_user:2503717624322301_kc@cluster0.xjtobyq.mongodb.net/online_test_system?retryWrites=true&w=majority"
)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((err) => {

    console.log(err);

});

// SCHEMA

const ResultSchema = new mongoose.Schema({

    // USER DETAILS

    name:String,

    age:String,

    profession:String,

    experience:String,

    email:String,

    college:String,

    department:String,

    // SCORE DETAILS

    score:Number,

    totalQuestions:Number,

    correctAnswers:Number,

    wrongAnswers:Number,

    accuracy:String,

    // SKIP ANALYSIS

    skippedByTimeout:Number,

    skippedWithTimeRemaining:Number,

    // ATTEMPT DETAILS

    attemptedQuestions:Number,

    attemptedAllQuestions:Boolean,

    // TIME ANALYSIS

    totalThinkingTime:Number,

    averageThinkingTime:String,

    fastAnsweredQuestions:Number,

    slowAnsweredQuestions:Number,

    // BEHAVIOR ANALYSIS

    behaviorAnalysis:String,

    // QUESTION ANALYSIS

    questionAnalysis:[

        {

            questionNumber:Number,

            status:String,

            selectedOption:String,

            correctAnswer:String,

            isCorrect:Boolean,

            thinkingTime:Number,

            skipReason:String

        }

    ],

    // RAW ANSWERS

    answers:[

        {

            question:String,

            image:String,

            selectedOption:String,

            correctAnswer:String,

            isCorrect:Boolean,

            timeTakenInSeconds:Number,

            skipReason:String

        }

    ],

    // SUBMISSION TIME

    submittedAt:{

        type:Date,

        default:Date.now

    }

});

