const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

mongoose.connect(
    "mongodb://127.0.0.1:27017/psvt_test_db"
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

    answers:[

        {

            question:String,

            image:String,

            selectedOption:String,

            correctAnswer:String,

            isCorrect:Boolean,

            timeTakenInSeconds:Number

        }

    ]

});

const Result =
    mongoose.model(
        "Result",
        ResultSchema
    );

// SAVE API
app.post("/save-result", async(req,res)=>{

    try{

        console.log(req.body);

        const newResult =
            new Result(req.body);

        await newResult.save();

        console.log("DATA SAVED");

        res.json({

            success:true,

            message:"Result Saved"

        });

    }catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            error:error.message

        });

    }

});

app.listen(3000, ()=>{

    console.log(
        "Server Running On Port 3000"
    );

});