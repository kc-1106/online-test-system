require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(bodyParser.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("MongoDB Connected");

})

.catch((err) => {

    console.log(err);

});


// ==========================================
// SCHEMA
// ==========================================

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

    submittedAt:String

});

const Result = mongoose.model(
    "Result",
    ResultSchema
);


// ==========================================
// SAVE RESULT API
// ==========================================

app.post("/save-result", async (req,res) => {

    try{

        console.log(req.body);

        const newResult = new Result(req.body);

        await newResult.save();

        res.status(200).json({

            success:true,

            message:"Result Saved"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:"Database Error"

        });

    }

});


// ==========================================
// GET RESULTS
// ==========================================

app.get("/results", async (req,res) => {

    try{

        const results =
            await Result.find();

        res.json(results);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false

        });

    }

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(

        `Server Running On Port ${PORT}`

    );

});