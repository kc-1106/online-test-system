const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Middleware configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Your MongoDB Connection Function (Crucial for Vercel)
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return; // If already connected, reuse the active connection
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully! ✅");
    } catch (error) {
        console.error("MongoDB Connection Failed ❌:", error.message);
    }
};

// 3. Your Schema and Model Definition (Keep your exact fields here)
const resultSchema = new mongoose.Schema({
    // Keep whatever fields you originally created here, for example:
    name: String,
    score: Number,
    answers: Array
}, { timestamps: true });

const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);

// 4. Your API endpoint to accept submission data
app.post('/save-result', async (req, res) => {
    try {
        // Ensure database connection wakes up before handling data
        await connectDB(); 

        console.log("Received data payload:", req.body);
        
        // Save the form submission directly to MongoDB
        const newResult = new Result(req.body);
        await newResult.save();
        
        res.status(200).json({ success: true, message: "Saved successfully" });
    } catch (err) {
        console.error("Route handling error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 5. Port Listening Configuration (Needed for local development fallback)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Legacy server listening on port ${PORT}...`);
});

module.exports = app;