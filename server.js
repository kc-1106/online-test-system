require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Result = require("./models/Result");

const app = express();

/* =====================================
   MIDDLEWARE
===================================== */

app.use(cors({
    origin: "*"
}));

app.use(express.json({
    limit: "50mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

/* =====================================
   STATIC FILES
===================================== */

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

/* =====================================
   HOME ROUTE
===================================== */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});

/* =====================================
   ADMIN DASHBOARD ROUTE
===================================== */

app.get("/admin", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "admin.html"
        )
    );

});

/* =====================================
   MONGODB CONNECTION
===================================== */

mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser: true,
    useUnifiedTopology: true

})

.then(() => {

    console.log("=================================");
    console.log("MongoDB Connected Successfully");
    console.log("=================================");

})

.catch((err) => {

    console.log("=================================");
    console.log("MongoDB Connection Failed");
    console.log(err);
    console.log("=================================");

});

/* =====================================
   SAVE RESULT API
===================================== */

app.post("/save-result", async (req, res) => {

    try {

        console.log("=================================");
        console.log("NEW RESULT RECEIVED");
        console.log("=================================");

        const reportData = req.body;

        /* ===============================
           VALIDATION
        =============================== */

        if(
            !reportData.name ||
            !reportData.email
        ){

            return res.status(400).json({

                success: false,

                error: "Name and Email Required"

            });

        }

        /* ===============================
           AUTO KPI CALCULATION
        =============================== */

        const totalQuestions =
            reportData.totalQuestions || 10;

        const score =
            reportData.score || 0;

        const wrongAnswers =
            reportData.wrongAnswers || 0;

        const skippedQuestions =
            (reportData.skippedByTimeout || 0) +
            (reportData.skippedWithTimeRemaining || 0);

        /* ACCURACY */

        const accuracy =
            totalQuestions > 0
            ? ((score / totalQuestions) * 100)
                .toFixed(2)
            : 0;

        /* COMPLETION RATE */

        const completionRate =
            totalQuestions > 0
            ? (((totalQuestions - skippedQuestions)
                / totalQuestions) * 100)
                .toFixed(2)
            : 0;

        /* CONFIDENCE SCORE */

        let confidenceScore = 0;

        if(reportData.fastAnsweredQuestions){

            confidenceScore =
                (
                    (
                        reportData.fastAnsweredQuestions
                        / totalQuestions
                    ) * 100
                ).toFixed(2);

        }

        /* HESITATION SCORE */

        let hesitationScore = 0;

        if(reportData.slowAnsweredQuestions){

            hesitationScore =
                (
                    (
                        reportData.slowAnsweredQuestions
                        / totalQuestions
                    ) * 100
                ).toFixed(2);

        }

        /* PERFORMANCE BAND */

        let performanceBand = "Average";

        if(score >= 8){

            performanceBand = "Excellent";

        }

        else if(score >= 5){

            performanceBand = "Good";

        }

        else{

            performanceBand = "Needs Improvement";

        }

        /* =================================
           FINAL DATABASE OBJECT
        ================================= */

        const finalData = {

            ...reportData,

            accuracy,

            completionRate,

            confidenceScore,

            hesitationScore,

            performanceBand,

            submittedAt: new Date()

        };

        /* =================================
           SAVE TO DATABASE
        ================================= */

        const newResult =
            new Result(finalData);

        await newResult.save();

        console.log("=================================");
        console.log("DATA SAVED SUCCESSFULLY");
        console.log("=================================");

        res.status(200).json({

            success: true,

            message: "Result Saved Successfully",

            data: finalData

        });

    }

    catch(error){

        console.log("=================================");
        console.log("DATABASE SAVE ERROR");
        console.log(error);
        console.log("=================================");

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

/* =====================================
   GET ALL RESULTS
===================================== */

app.get("/results", async (req, res) => {

    try {

        const results = await Result.find()

        .sort({

            submittedAt: -1

        });

        res.status(200).json(results);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

/* =====================================
   KPI DASHBOARD API
===================================== */

app.get("/kpi-dashboard", async (req, res) => {

    try {

        const results =
            await Result.find();

        const totalStudents =
            results.length;

        let totalScore = 0;

        let totalAccuracy = 0;

        let totalConfidence = 0;

        let totalCompletion = 0;

        let excellentStudents = 0;

        let averageStudents = 0;

        let weakStudents = 0;

        results.forEach((student) => {

            totalScore +=
                student.score || 0;

            totalAccuracy +=
                parseFloat(
                    student.accuracy
                ) || 0;

            totalConfidence +=
                parseFloat(
                    student.confidenceScore
                ) || 0;

            totalCompletion +=
                parseFloat(
                    student.completionRate
                ) || 0;

            if(student.performanceBand === "Excellent"){

                excellentStudents++;

            }

            else if(student.performanceBand === "Good"){

                averageStudents++;

            }

            else{

                weakStudents++;

            }

        });

        const dashboard = {

            totalStudents,

            averageScore:
                totalStudents > 0
                ? (
                    totalScore /
                    totalStudents
                  ).toFixed(2)
                : 0,

            averageAccuracy:
                totalStudents > 0
                ? (
                    totalAccuracy /
                    totalStudents
                  ).toFixed(2)
                : 0,

            averageConfidence:
                totalStudents > 0
                ? (
                    totalConfidence /
                    totalStudents
                  ).toFixed(2)
                : 0,

            averageCompletionRate:
                totalStudents > 0
                ? (
                    totalCompletion /
                    totalStudents
                  ).toFixed(2)
                : 0,

            excellentStudents,

            averageStudents,

            weakStudents

        };

        res.status(200).json(dashboard);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

/* =====================================
   TOP STUDENTS API
===================================== */

app.get("/top-students", async (req, res) => {

    try {

        const topStudents =
            await Result.find()

            .sort({

                score: -1,

                confidenceScore: -1

            })

            .limit(10);

        res.status(200).json(topStudents);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

/* =====================================
   SINGLE STUDENT ANALYTICS
===================================== */

app.get(
    "/student/:email",
    async (req, res) => {

    try {

        const student =
            await Result.findOne({

                email: req.params.email

            });

        if(!student){

            return res.status(404).json({

                success:false,

                error:"Student Not Found"

            });

        }

        res.status(200).json(student);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            error:error.message

        });

    }

});

/* =====================================
   DELETE RESULT
===================================== */

app.delete(
    "/delete-result/:id",
    async (req, res) => {

    try {

        await Result.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success: true,

            message: "Result Deleted"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

/* =====================================
   SERVER
===================================== */

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log(
        `Server Running On Port ${PORT}`
    );
    console.log("=================================");

});