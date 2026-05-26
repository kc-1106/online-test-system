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

    name:String,

    age:String,

    profession:String,

    experience:String,

    email:String,

    college:String,

    department:String,

    score:Number,

    totalQuestions:Number,

    correctAnswers:Number,

    wrongAnswers:Number,

    accuracy:String,

    skippedByTimeout:Number,

    skippedWithTimeRemaining:Number,

    attemptedQuestions:Number,

    attemptedAllQuestions:Boolean,

    totalThinkingTime:Number,

    averageThinkingTime:String,

    fastAnsweredQuestions:Number,

    slowAnsweredQuestions:Number,

    behaviorAnalysis:String,

    questionAnalysis:Array,

    answers:Array,

    submittedAt:Date

});