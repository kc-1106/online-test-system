const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

// Schema

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

    submittedAt:{
        type:Date,
        default:Date.now
    }

});

const Result = mongoose.model("Result", ResultSchema);

// TEST ROUTE

app.get("/", (req, res) => {
    res.send("Server Running Successfully");
});

// SAVE RESULT ROUTE

app.post("/submit-result", async (req, res) => {

    try {

        const newResult = new Result(req.body);

        await newResult.save();

        res.status(200).json({
            success:true,
            message:"Result Saved Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success:false,
            message:"Error Saving Result"
        });

    }

});

// IMPORTANT FOR VERCEL

module.exports = app;