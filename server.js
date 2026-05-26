const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ===============================
// SERVE FRONTEND FILES
// ===============================
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// MONGODB CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => {
    console.log("MongoDB Connection Failed ❌");
    console.log(err);
});
// ===============================
// SCHEMA
// ===============================
const ResultSchema = new mongoose.Schema({
    name: String,
    age: String,
    profession: String,
    experience: String,
    email: String,
    college: String,
    department: String,
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    wrongAnswers: Number,
    accuracy: String,
    skippedByTimeout: Number,
    skippedWithTimeRemaining: Number,
    attemptedQuestions: Number,
    totalThinkingTime: Number,
    averageThinkingTime: String,
    fastAnsweredQuestions: Number,
    slowAnsweredQuestions: Number,
    behaviorAnalysis: String,
    questionAnalysis: Array,
    answers: Array,
    submittedAt: String
});

const Result = mongoose.model("Result", ResultSchema);

// ===============================
// SAVE RESULT
// ===============================
app.post("/save-result", async (req,res) => {
    try {
        console.log("DATA RECEIVED:", req.body);

        const newResult = new Result(req.body);
        await newResult.save();

        console.log("SAVED SUCCESSFULLY");

        res.json({ success:true });

    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({ success:false });
    }
});

// ===============================
// GET RESULTS
// ===============================
app.get("/results", async (req, res) => {
    const results = await Result.find();
    res.json(results);
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});