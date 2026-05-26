const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// =========================
// MongoDB Connection
// =========================

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((err) => {

    console.log(err);

});

// =========================
// Schema
// =========================

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

    // SKIP DETAILS

    skippedQuestions:Number,

    skippedByTimeout:Number,

    skippedWithTimeRemaining:Number,

    skippedEasyQuestions:Number,

    // ATTEMPT DETAILS

    attemptedQuestions:Number,

    attemptedAllQuestions:Boolean,

    // TIME ANALYSIS

    totalThinkingTime:Number,

    averageThinkingTime:String,

    fastAnsweredQuestions:Number,

    slowAnsweredQuestions:Number,

    // AI ANALYTICS

    confidenceScore:String,

    guessingBehavior:Boolean,

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

            difficulty:String,

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

const Result = mongoose.model("Result", ResultSchema);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {

    res.send("Server Running Successfully");

});

// =========================
// SUBMIT RESULT ROUTE
// =========================

app.post("/submit-result", async (req, res) => {

    try {

        const data = req.body;

        // =========================
        // TOTAL QUESTIONS
        // =========================

        const totalQuestions = data.answers.length;

        // =========================
        // ATTEMPTED QUESTIONS
        // =========================

        const attemptedQuestions = data.answers.filter(

            ans => ans.selectedOption && ans.selectedOption !== ""

        ).length;

        // =========================
        // CORRECT ANSWERS
        // =========================

        const correctAnswers = data.answers.filter(

            ans => ans.isCorrect === true

        ).length;

        // =========================
        // WRONG ANSWERS
        // =========================

        const wrongAnswers = attemptedQuestions - correctAnswers;

        // =========================
        // SKIPPED QUESTIONS
        // =========================

        const skippedQuestions = totalQuestions - attemptedQuestions;

        // =========================
        // ACCURACY
        // =========================

        const accuracy = attemptedQuestions > 0

        ? ((correctAnswers / attemptedQuestions) * 100).toFixed(2) + "%"

        : "0%";

        // =========================
        // TOTAL THINKING TIME
        // =========================

        const totalThinkingTime = data.answers.reduce(

            (sum, ans) => sum + (ans.timeTakenInSeconds || 0),

            0

        );

        // =========================
        // AVERAGE THINKING TIME
        // =========================

        const averageThinkingTime = totalQuestions > 0

        ? (totalThinkingTime / totalQuestions).toFixed(2)

        : "0";

        // =========================
        // FAST / SLOW ANALYSIS
        // =========================

        let fastAnsweredQuestions = 0;

        let slowAnsweredQuestions = 0;

        data.answers.forEach(ans => {

            if(ans.timeTakenInSeconds <= 5){

                fastAnsweredQuestions++;

            }

            if(ans.timeTakenInSeconds >= 20){

                slowAnsweredQuestions++;

            }

        });

        // =========================
        // SKIPPED EASY QUESTIONS
        // =========================

        const skippedEasyQuestions = data.answers.filter(

            ans =>

                ans.skipReason &&

                ans.difficulty === "easy"

        ).length;

        // =========================
        // GUESSING BEHAVIOR
        // =========================

        const guessingBehavior = data.answers.some(

            ans =>

                ans.timeTakenInSeconds <= 2 &&

                ans.isCorrect === false

        );

        // =========================
        // CONFIDENCE SCORE
        // =========================

        const confidenceValue =

            (

                (correctAnswers * 10)

                +

                (attemptedQuestions * 2)

                -

                (skippedQuestions * 3)

            );

        const confidenceScore = confidenceValue + "%";

        // =========================
        // ATTEMPTED ALL QUESTIONS
        // =========================

        const attemptedAllQuestions =

            attemptedQuestions === totalQuestions;

        // =========================
        // BEHAVIOR ANALYSIS
        // =========================

        let behaviorAnalysis = "";

        if(

            correctAnswers >= totalQuestions * 0.8 &&

            averageThinkingTime <= 10

        ){

            behaviorAnalysis = "Fast and Accurate Performer";

        }

        else if(

            correctAnswers >= totalQuestions * 0.8 &&

            averageThinkingTime > 10

        ){

            behaviorAnalysis = "Careful and Accurate Thinker";

        }

        else if(

            slowAnsweredQuestions > fastAnsweredQuestions

        ){

            behaviorAnalysis = "Slow Decision Maker";

        }

        else if(

            skippedQuestions > totalQuestions / 2

        ){

            behaviorAnalysis = "Low Confidence Candidate";

        }

        else if(

            guessingBehavior

        ){

            behaviorAnalysis = "Possible Random Guessing";

        }

        else{

            behaviorAnalysis = "Balanced Performer";

        }

        // =========================
        // SAVE TO DATABASE
        // =========================

        const newResult = new Result({

            ...data,

            totalQuestions,

            attemptedQuestions,

            attemptedAllQuestions,

            correctAnswers,

            wrongAnswers,

            skippedQuestions,

            skippedEasyQuestions,

            accuracy,

            totalThinkingTime,

            averageThinkingTime,

            fastAnsweredQuestions,

            slowAnsweredQuestions,

            confidenceScore,

            guessingBehavior,

            behaviorAnalysis

        });

        await newResult.save();

        // =========================
        // SUCCESS RESPONSE
        // =========================

        res.status(200).json({

            success:true,

            message:"Result Saved Successfully",

            analytics:{

                totalQuestions,

                attemptedQuestions,

                correctAnswers,

                wrongAnswers,

                skippedQuestions,

                accuracy,

                averageThinkingTime,

                fastAnsweredQuestions,

                slowAnsweredQuestions,

                confidenceScore,

                guessingBehavior,

                behaviorAnalysis

            }

        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

});

// =========================
// IMPORTANT FOR VERCEL
// =========================

module.exports = app;