require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors({
    origin: "*"
}));

app.use(express.json());

// ======================================
// STATIC FRONTEND FILES
// ======================================

app.use(express.static(path.join(__dirname, "public")));

// ======================================
// HOME ROUTE
// ======================================

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

// ======================================
// MONGODB CONNECTION
// ======================================

mongoose.connect(process.env.MONGO_URI)

.then(() => {

    console.log("MongoDB Connected Successfully");

})

.catch((err) => {

    console.log("MongoDB Connection Failed");
    console.log(err);

});

// ======================================
// SCHEMA
// ======================================

const ResultSchema = new mongoose.Schema({}, {

    strict:false

});

const Result = mongoose.model("Result", ResultSchema);

// ======================================
// SAVE RESULT
// ======================================

app.post("/save-result", async (req,res) => {

    try{

        console.log(req.body);

        const newResult = new Result(req.body);

        await newResult.save();

        res.json({

            success:true,
            message:"Saved Successfully"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

// ======================================
// GET RESULTS
// ======================================

app.get("/results", async (req,res) => {

    try{

        const results = await Result.find();

        res.json(results);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});