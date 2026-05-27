require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

// =============================
// ROOT ROUTE
// =============================

app.get("/", (req, res) => {

    res.send("Backend Server Running");

});

// =============================
// MONGODB CONNECTION
// =============================

mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser: true,
    useUnifiedTopology: true

})

.then(() => {

    console.log("MongoDB Connected Successfully");

})

.catch((err) => {

    console.log("MongoDB Connection Failed");
    console.log(err);

});

// =============================
// SCHEMA
// =============================

const ResultSchema = new mongoose.Schema({}, {

    strict: false

});

const Result = mongoose.model(
    "Result",
    ResultSchema
);

// =============================
// SAVE RESULT
// =============================

app.post("/save-result", async (req, res) => {

    try {

        console.log("Incoming Data:");
        console.log(req.body);

        const newResult = new Result(req.body);

        await newResult.save();

        console.log("Saved To MongoDB");

        res.status(200).json({

            success: true,
            message: "Saved Successfully"

        });

    }

    catch (error) {

        console.log("SAVE ERROR:");
        console.log(error);

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});

// =============================
// GET RESULTS
// =============================

app.get("/results", async (req, res) => {

    try {

        const results = await Result.find();

        res.status(200).json(results);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});

// =============================
// SERVER
// =============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});