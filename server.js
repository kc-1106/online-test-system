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
   ADMIN DASHBOARD
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

mongoose.connect(process.env.MONGO_URI)

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

        const reportData = req.body;

        if(
            !reportData.name ||
            !reportData.email
        ){

            return res.status(400).json({

                success:false,
                error:"Name and Email Required"

            });

        }

        /* =====================================
           AUTO KPI CALCULATION
        ===================================== */

        const totalQuestions =
            reportData.totalQuestions || 10;

        const score =
            reportData.score || 0;

        const skippedQuestions =
            (reportData.skippedByTimeout || 0) +
            (reportData.skippedWithTimeRemaining || 0);

        const accuracy =
            (
                (score / totalQuestions) * 100
            ).toFixed(2);

        const completionRate =
            (
                (
                    (totalQuestions - skippedQuestions)
                    / totalQuestions
                ) * 100
            ).toFixed(2);

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

        const finalData = {

            ...reportData,

            accuracy,

            completionRate,

            performanceBand,

            submittedAt:new Date()

        };

        const newResult =
            new Result(finalData);

        await newResult.save();

        res.status(200).json({

            success:true,
            message:"Result Saved Successfully"

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

/* =====================================
   GET ALL RESULTS
===================================== */

app.get("/results", async (req, res) => {

    try {

        const results =
            await Result.find()

            .sort({

                submittedAt:-1

            });

        res.json(results);

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

/* =====================================
   KPI DASHBOARD
===================================== */

app.get("/kpi-dashboard", async (req, res) => {

    try {

        const results =
            await Result.find();

        const totalStudents =
            results.length;

        let totalScore = 0;

        let totalAccuracy = 0;

        let excellentStudents = 0;

        let goodStudents = 0;

        let weakStudents = 0;

        results.forEach(student => {

            totalScore +=
                student.score || 0;

            totalAccuracy +=
                parseFloat(student.accuracy) || 0;

            if(student.performanceBand === "Excellent"){

                excellentStudents++;

            }

            else if(student.performanceBand === "Good"){

                goodStudents++;

            }

            else{

                weakStudents++;

            }

        });

        res.json({

            totalStudents,

            averageScore:
                totalStudents > 0
                ? (
                    totalScore / totalStudents
                  ).toFixed(2)
                : 0,

            averageAccuracy:
                totalStudents > 0
                ? (
                    totalAccuracy / totalStudents
                  ).toFixed(2)
                : 0,

            excellentStudents,
            goodStudents,
            weakStudents

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

/* =====================================
   GENDER ANALYTICS API
===================================== */

app.get("/gender-analytics", async (req, res) => {

    try {

        const results =
            await Result.find();

        const maleStudents =
            results.filter(
                s => s.gender === "Male"
            );

        const femaleStudents =
            results.filter(
                s => s.gender === "Female"
            );

        function calculateAverage(data){

            if(data.length === 0){

                return 0;

            }

            let total = 0;

            data.forEach(s => {

                total += s.score || 0;

            });

            return (
                total / data.length
            ).toFixed(2);

        }

        res.json({

            maleCount:
                maleStudents.length,

            femaleCount:
                femaleStudents.length,

            maleAverage:
                calculateAverage(maleStudents),

            femaleAverage:
                calculateAverage(femaleStudents)

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

/* =====================================
   CLUSTER ANALYTICS
===================================== */

app.get("/cluster-analytics", async (req, res) => {

    try {

        const results =
            await Result.find();

        const clusters = {

            easy:[1,2,6,10],

            moderate:[3,4,5],

            hard:[7,8,9]

        };

        let analytics = {

            easy:0,
            moderate:0,
            hard:0

        };

        let totalStudents =
            results.length;

        results.forEach(student => {

            if(!student.answers) return;

            student.answers.forEach((ans,index) => {

                const qNo = index + 1;

                if(ans.isCorrect){

                    if(clusters.easy.includes(qNo)){

                        analytics.easy++;

                    }

                    if(clusters.moderate.includes(qNo)){

                        analytics.moderate++;

                    }

                    if(clusters.hard.includes(qNo)){

                        analytics.hard++;

                    }

                }

            });

        });

        const easyTotal =
            totalStudents * 4;

        const moderateTotal =
            totalStudents * 3;

        const hardTotal =
            totalStudents * 3;

        res.json({

            easyAccuracy:
                easyTotal > 0
                ? (
                    (analytics.easy / easyTotal) * 100
                  ).toFixed(2)
                : 0,

            moderateAccuracy:
                moderateTotal > 0
                ? (
                    (analytics.moderate / moderateTotal) * 100
                  ).toFixed(2)
                : 0,

            hardAccuracy:
                hardTotal > 0
                ? (
                    (analytics.hard / hardTotal) * 100
                  ).toFixed(2)
                : 0

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

/* =====================================
   TOP STUDENTS
===================================== */

app.get("/top-students", async (req, res) => {

    try {

        const topStudents =
            await Result.find()

            .sort({

                score:-1

            })

            .limit(10);

        res.json(topStudents);

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

/* =====================================
   DELETE RESULT
===================================== */

app.delete("/delete-result/:id",
async (req, res) => {

    try {

        await Result.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success:true,
            message:"Deleted Successfully"

        });

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

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
    console.log(`Server Running On Port ${PORT}`);
    console.log("=================================");

});