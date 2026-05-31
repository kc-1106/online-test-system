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

app.use(cors());

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

app.use(express.static(
    path.join(__dirname, "public")
));

/* =====================================
   HOME PAGE
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
   ADMIN PAGE
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
    console.log("MongoDB Connected");
    console.log("=================================");

})

.catch(err => {

    console.log("MongoDB Error");
    console.log(err);

});

/* =====================================
   SAVE RESULT
===================================== */

app.post("/save-result", async (req, res) => {

    try {

        const data = req.body;

        if (!data.name || !data.email) {

            return res.status(400).json({

                success: false,
                error: "Name and Email Required"

            });

        }

        const totalQuestions =
            data.totalQuestions || 10;

        const score =
            data.score || 0;

        const skippedQuestions =
            (data.skippedByTimeout || 0)
            +
            (data.skippedWithTimeRemaining || 0);

        const accuracy =
            (
                (score / totalQuestions) * 100
            ).toFixed(2);

        const completionRate =
            (
                (
                    (totalQuestions - skippedQuestions)
                    /
                    totalQuestions
                ) * 100
            ).toFixed(2);

        let performanceBand = "Needs Improvement";

        if(score >= 8){

            performanceBand = "Excellent";

        }
        else if(score >= 5){

            performanceBand = "Good";

        }

        const result = new Result({

            ...data,

            accuracy,
            completionRate,
            performanceBand,

            submittedAt: new Date()

        });

        await result.save();

        res.json({

            success: true,
            message: "Result Saved"

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

        const results = await Result.find()

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
                parseFloat(student.accuracy || 0);

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
                ?
                (
                    totalScore /
                    totalStudents
                ).toFixed(2)
                :
                0,

            averageAccuracy:
                totalStudents > 0
                ?
                (
                    totalAccuracy /
                    totalStudents
                ).toFixed(2)
                :
                0,

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
   GENDER ANALYTICS
===================================== */

app.get("/gender-analytics", async (req, res) => {

    try {

        const students =
            await Result.find();

        const male =
            students.filter(
                s => s.gender === "Male"
            );

        const female =
            students.filter(
                s => s.gender === "Female"
            );

        const avg = (arr) => {

            if(arr.length === 0) return 0;

            const total =
                arr.reduce(
                    (sum,s) =>
                    sum + (s.score || 0),
                    0
                );

            return (
                total / arr.length
            ).toFixed(2);

        };

        res.json({

            maleCount:
                male.length,

            femaleCount:
                female.length,

            maleAverage:
                avg(male),

            femaleAverage:
                avg(female)

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

        const students =
            await Result.find();

        const easyQuestions =
            [1,2,6,10];

        const moderateQuestions =
            [3,4,5];

        const hardQuestions =
            [7,8,9];

        let easyCorrect = 0;
        let moderateCorrect = 0;
        let hardCorrect = 0;

        students.forEach(student => {

            if(!student.answers) return;

            student.answers.forEach((answer,index)=>{

                const qNo = index + 1;

                if(answer.isCorrect){

                    if(
                        easyQuestions.includes(qNo)
                    ){
                        easyCorrect++;
                    }

                    if(
                        moderateQuestions.includes(qNo)
                    ){
                        moderateCorrect++;
                    }

                    if(
                        hardQuestions.includes(qNo)
                    ){
                        hardCorrect++;
                    }

                }

            });

        });

        const easyTotal =
            students.length * 4;

        const moderateTotal =
            students.length * 3;

        const hardTotal =
            students.length * 3;

        res.json({

            easyAccuracy:
                easyTotal > 0
                ?
                (
                    easyCorrect /
                    easyTotal *
                    100
                ).toFixed(2)
                :
                0,

            moderateAccuracy:
                moderateTotal > 0
                ?
                (
                    moderateCorrect /
                    moderateTotal *
                    100
                ).toFixed(2)
                :
                0,

            hardAccuracy:
                hardTotal > 0
                ?
                (
                    hardCorrect /
                    hardTotal *
                    100
                ).toFixed(2)
                :
                0

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
   SCATTER PLOT DATA
===================================== */

app.get("/scatter-data", async (req, res) => {

    try {

        const results =
            await Result.find();

        const data =
            results.map(student => ({

                name:
                    student.name,

                score:
                    student.score || 0,

                thinkingTime:
                    student.totalThinkingTime || 0

            }));

        res.json(data);

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

        const students =
            await Result.find()

            .sort({

                score:-1

            })

            .limit(10);

        res.json(students);

    }

    catch(error){

        res.status(500).json({

            success:false,
            error:error.message

        });

    }

});

/* =====================================
   SINGLE STUDENT
===================================== */

app.get("/student/:email", async (req, res) => {

    try {

        const student =
            await Result.findOne({

                email:
                    req.params.email

            });

        if(!student){

            return res.status(404).json({

                success:false,
                error:"Student Not Found"

            });

        }

        res.json(student);

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

app.delete("/delete-result/:id", async (req, res) => {

    try {

        await Result.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success:true,
            message:"Deleted"

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
   PERFORMANCE BY GENDER
===================================== */

app.get("/performance-by-gender", async (req, res) => {

    try {

        const students = await Result.find();

        const easyQuestions = [1,2,6,10];
        const moderateQuestions = [3,4,5];
        const hardQuestions = [7,8,9];

        function calculatePerformance(studentList){

            let easyCorrect = 0;
            let moderateCorrect = 0;
            let hardCorrect = 0;

            studentList.forEach(student => {

                if(!student.answers) return;

                student.answers.forEach((answer,index) => {

                    const qNo = index + 1;

                    if(answer.isCorrect){

                        if(easyQuestions.includes(qNo))
                            easyCorrect++;

                        if(moderateQuestions.includes(qNo))
                            moderateCorrect++;

                        if(hardQuestions.includes(qNo))
                            hardCorrect++;
                    }

                });

            });

            const totalStudents = studentList.length;

            const easyTotal = totalStudents * 4;
            const moderateTotal = totalStudents * 3;
            const hardTotal = totalStudents * 3;

            const easy =
                easyTotal > 0
                ? Number(((easyCorrect/easyTotal)*100).toFixed(2))
                : 0;

            const moderate =
                moderateTotal > 0
                ? Number(((moderateCorrect/moderateTotal)*100).toFixed(2))
                : 0;

            const hard =
                hardTotal > 0
                ? Number(((hardCorrect/hardTotal)*100).toFixed(2))
                : 0;

            const overall =
                Number(((easy + moderate + hard)/3).toFixed(2));

            return {
                easy,
                moderate,
                hard,
                overall
            };
        }

        const males =
            students.filter(
                s => (s.gender || "").toLowerCase() === "male"
            );

        const females =
            students.filter(
                s => (s.gender || "").toLowerCase() === "female"
            );

        res.json({

            overall:
                calculatePerformance(students),

            male:
                calculatePerformance(males),

            female:
                calculatePerformance(females)

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