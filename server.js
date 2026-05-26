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
app.post("/save-result", async (req, res) => {

    try{

        const result = new Result({

            // USER DETAILS

            name:req.body.name,

            age:req.body.age,

            profession:req.body.profession,

            experience:req.body.experience,

            email:req.body.email,

            college:req.body.college,

            department:req.body.department,

            // SCORE DETAILS

            score:req.body.score,

            totalQuestions:req.body.totalQuestions,

            correctAnswers:req.body.correctAnswers,

            wrongAnswers:req.body.wrongAnswers,

            accuracy:req.body.accuracy,

            // SKIP ANALYSIS

            skippedByTimeout:
                req.body.skippedByTimeout,

            skippedWithTimeRemaining:
                req.body.skippedWithTimeRemaining,

            // ATTEMPT ANALYSIS

            attemptedQuestions:
                req.body.attemptedQuestions,

            attemptedAllQuestions:
                req.body.attemptedAllQuestions,

            // TIME ANALYSIS

            totalThinkingTime:
                req.body.totalThinkingTime,

            averageThinkingTime:
                req.body.averageThinkingTime,

            fastAnsweredQuestions:
                req.body.fastAnsweredQuestions,

            slowAnsweredQuestions:
                req.body.slowAnsweredQuestions,

            // BEHAVIOR

            behaviorAnalysis:
                req.body.behaviorAnalysis,

            // QUESTION ANALYSIS

            questionAnalysis:
                req.body.questionAnalysis,

            // ANSWERS

            answers:req.body.answers,

            submittedAt:
                req.body.submittedAt

        });

        await result.save();

        res.json({

            success:true,

            message:"Result saved successfully"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:"Error saving result"

        });

    }

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