const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serverless-Safe MongoDB Connection Function
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return; // Reuse active connection if already open
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully! ✅");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌:", error.message);
    }
};

// 3. Fully Mapped Schema Definition (Matching frontend payload exactly)
const resultSchema = new mongoose.Schema({
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
}, { timestamps: true });

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

app.get("/results", async (req,res) => {

    try{

        const results = await Result.find();

        res.json(results);

    }

    catch(error){

    console.log("RESULT ERROR:", error);

    res.status(500).json({

        success:false,
        error:error.message

    });

}
});

// 5. Port Listening Configuration (Fallback for local testing)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;