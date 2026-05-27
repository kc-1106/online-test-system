const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

// Update your CORS middleware area to look like this:
app.use(cors({
    origin: "*", // Allows any frontend client domain to deliver payloads safely
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

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
// Add this temporary log line to see what Vercel is reading:
console.log("CURRENT ACTIVE URI IS:", process.env.MONGO_URI);

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
app.post("/save-result", async (req, res) => {
    try {
        console.log("DATA RECEIVED:", req.body);

        if (!req.body || !req.body.email) {
            return res.status(400).json({
                success: false,
                message: "Invalid data received"
            });
        }

        const newResult = new Result(req.body);
        const saved = await newResult.save();

        console.log("SAVED:", saved);

        res.status(200).json({
            success: true,
            message: "Result saved successfully"
        });

    } catch (error) {
        console.log("ERROR SAVING:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
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