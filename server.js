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

// 4. API Endpoint to Accept and Save Data
app.post('/save-result', async (req, res) => {
    try {
        // Ensure database connection wakes up
        await connectDB(); 

        console.log("Received data payload:", req.body);
        
        // Save the form submission data directly to MongoDB
        const newResult = new Result(req.body);
        await newResult.save();
        
        res.status(200).json({ success: true, message: "Saved successfully! Data is now in MongoDB." });
    } catch (err) {
        console.error("Route handling error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 5. Port Listening Configuration (Fallback for local testing)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;