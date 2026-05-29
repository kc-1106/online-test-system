const questions = [

    { question: "Question 1", image: "images/q1.png", options: ["A","B","C","D","E"], answer: "C" },
    { question: "Question 2", image: "images/q2.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 3", image: "images/q3.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 4", image: "images/q4.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 5", image: "images/q5.png", options: ["A","B","C","D","E"], answer: "D" },
    { question: "Question 6", image: "images/q6.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 7", image: "images/q7.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 8", image: "images/q8.png", options: ["A","B","C","D","E"], answer: "B" },
    { question: "Question 9", image: "images/q9.png", options: ["A","B","C","D","E"], answer: "D" },
    { question: "Question 10", image: "images/q10.png", options: ["A","B","C","D","E"], answer: "C" }

];

// =====================================
// QUESTION CLUSTERS
// =====================================

const clusters = {

    easy: [1,2,6,10],

    moderate: [3,4,5],

    hard: [7,8,9]

};

// =====================================
// VARIABLES
// =====================================

let currentQuestion = 0;

let userAnswers = Array(questions.length).fill(null);

let questionTimers = Array(questions.length).fill(60);

let localTimer;

let localTime = 60;

let globalTime = 600;

let globalTimer;

// =====================================
// START TEST
// =====================================

function startTest(){

    const fields = [

        "name",
        "age",
        "profession",
        "experience",
        "email",
        "college",
        "department",
        "gender"

    ];

    for(let f of fields){

        const val =
            document.getElementById(f).value.trim();

        if(val === ""){

            alert("Please fill all fields");

            return;
        }
    }

    const email =
        document.getElementById("email").value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Enter Valid Email");

        return;
    }

    document.getElementById(
        "registrationForm"
    ).style.display = "none";

    document.getElementById(
        "instructionPage"
    ).style.display = "block";
}

// =====================================
// BEGIN TEST
// =====================================

function beginActualTest(){

    document.getElementById(
        "instructionPage"
    ).style.display = "none";

    document.getElementById(
        "testSection"
    ).style.display = "block";

    document.getElementById(
        "displayUserName"
    ).innerText =
        document.getElementById("name").value;

    document.getElementById(
        "displayUserEmail"
    ).innerText =
        document.getElementById("email").value;

    startGlobalTimer();

    loadQuestion();
}

// =====================================
// GLOBAL TIMER
// =====================================

function startGlobalTimer(){

    globalTimer = setInterval(() => {

        globalTime--;

        let m =
            Math.floor(globalTime / 60);

        let s =
            globalTime % 60;

        document.getElementById(
            "globalTimer"
        ).innerText =

            `${m}:${s < 10 ? "0"+s : s}`;

        if(globalTime <= 0){

            clearInterval(globalTimer);

            finishTest();
        }

    },1000);
}

// =====================================
// LOCAL TIMER
// =====================================

function startLocalTimer(){

    clearInterval(localTimer);

    localTime =
        questionTimers[currentQuestion];

    document.getElementById(
        "timer"
    ).innerText = localTime;

    localTimer = setInterval(() => {

        localTime--;

        questionTimers[currentQuestion] =
            localTime;

        document.getElementById(
            "timer"
        ).innerText = localTime;

        if(localTime <= 0){

            clearInterval(localTimer);

            if(!userAnswers[currentQuestion]){

                saveSkippedAnswer("timeout");
            }

            nextQuestion();
        }

    },1000);
}

// =====================================
// LOAD QUESTION
// =====================================

function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById(
        "questionTitle"
    ).innerText = q.question;

    document.getElementById(
        "questionImage"
    ).src = q.image;

    let html = "";

    q.options.forEach(opt => {

        const checked =

            userAnswers[currentQuestion]?.selectedOption === opt

            ? "checked"

            : "";

        html += `

            <label class="option">

                <input
                    type="radio"
                    name="option"
                    value="${opt}"
                    ${checked}
                    onchange="selectAnswer('${opt}')"
                >

                <div style="margin-top:10px">

                    ${opt}

                </div>

            </label>

        `;
    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML = html;

    updateQuestionStatus();

    startLocalTimer();

    document.getElementById(
        "prevBtn"
    ).disabled = currentQuestion === 0;

    document.getElementById(
        "nextBtn"
    ).innerText =

        currentQuestion === questions.length - 1

        ? "Finish Test"

        : "Next Question";
}

// =====================================
// SELECT ANSWER
// =====================================

function selectAnswer(ans){

    const timeTaken =

        60 - questionTimers[currentQuestion];

    userAnswers[currentQuestion] = {

        question:
            questions[currentQuestion].question,

        image:
            questions[currentQuestion].image,

        selectedOption: ans,

        correctAnswer:
            questions[currentQuestion].answer,

        isCorrect:
            ans === questions[currentQuestion].answer,

        timeTakenInSeconds:
            timeTaken,

        skipReason:
            "none"
    };

    updateQuestionStatus();
}

// =====================================
// SAVE SKIPPED
// =====================================

function saveSkippedAnswer(reason){

    userAnswers[currentQuestion] = {

        question:
            questions[currentQuestion].question,

        image:
            questions[currentQuestion].image,

        selectedOption:
            "Not Answered",

        correctAnswer:
            questions[currentQuestion].answer,

        isCorrect:false,

        timeTakenInSeconds:
            60 - questionTimers[currentQuestion],

        skipReason: reason
    };
}

// =====================================
// QUESTION STATUS
// =====================================

function updateQuestionStatus(){

    let html = "";

    for(let i = 0; i < questions.length; i++){

        let cls = "white";

        if(userAnswers[i]){

            if(
                userAnswers[i].selectedOption
                !== "Not Answered"
            ){

                if(
                    userAnswers[i]
                    .timeTakenInSeconds >= 55
                ){

                    cls = "orange";

                }else{

                    cls = "green";
                }

            }else{

                if(
                    userAnswers[i]
                    .skipReason === "timeout"
                ){

                    cls = "brown";

                }else{

                    cls = "red";
                }
            }
        }

        if(i === currentQuestion){

            cls += " current";
        }

        html += `

            <div
                class="status-circle ${cls}"
                onclick="goToQuestion(${i})"
            >

                ${i+1}

            </div>

        `;
    }

    document.getElementById(
        "questionStatusContainer"
    ).innerHTML = html;
}

// =====================================
// GO TO QUESTION
// =====================================

function goToQuestion(i){

    clearInterval(localTimer);

    if(!userAnswers[currentQuestion]){

        saveSkippedAnswer("manual-skip");
    }

    currentQuestion = i;

    loadQuestion();
}

// =====================================
// NEXT QUESTION
// =====================================

function nextQuestion(){

    clearInterval(localTimer);

    if(!userAnswers[currentQuestion]){

        saveSkippedAnswer("manual-skip");
    }

    if(currentQuestion === questions.length - 1){

        finishTest();

        return;
    }

    currentQuestion++;

    loadQuestion();
}

// =====================================
// PREVIOUS QUESTION
// =====================================

function previousQuestion(){

    clearInterval(localTimer);

    if(!userAnswers[currentQuestion]){

        saveSkippedAnswer("manual-skip");
    }

    if(currentQuestion > 0){

        currentQuestion--;

        loadQuestion();
    }
}

// =====================================
// FINISH TEST
// =====================================

async function finishTest(){

    clearInterval(globalTimer);

    clearInterval(localTimer);

    let score = 0;

    let correctAnswers = 0;

    let wrongAnswers = 0;

    let skippedByTimeout = 0;

    let skippedWithTimeRemaining = 0;

    let totalThinkingTime = 0;

    let fastAnsweredQuestions = 0;

    let slowAnsweredQuestions = 0;

    let easyCorrect = 0;

    let moderateCorrect = 0;

    let hardCorrect = 0;

    const questionAnalysis = [];

    // =====================================
    // ANALYSIS
    // =====================================

    userAnswers.forEach((a,index) => {

        if(!a){

            skippedWithTimeRemaining++;

            return;
        }

        totalThinkingTime +=
            a.timeTakenInSeconds;

        // CLUSTER ANALYSIS

        if(a.isCorrect){

            const qNo = index + 1;

            if(clusters.easy.includes(qNo)){

                easyCorrect++;
            }

            if(clusters.moderate.includes(qNo)){

                moderateCorrect++;
            }

            if(clusters.hard.includes(qNo)){

                hardCorrect++;
            }
        }

        // ANSWERED

        if(
            a.selectedOption !== "Not Answered"
        ){

            if(a.isCorrect){

                score++;

                correctAnswers++;

            }else{

                wrongAnswers++;
            }

            if(a.timeTakenInSeconds <= 15){

                fastAnsweredQuestions++;
            }

            if(a.timeTakenInSeconds >= 45){

                slowAnsweredQuestions++;
            }

        }

        // NOT ANSWERED

        else{

            wrongAnswers++;

            if(a.skipReason === "timeout"){

                skippedByTimeout++;

            }else{

                skippedWithTimeRemaining++;
            }
        }

        questionAnalysis.push({

            questionIndex: index + 1,

            selected: a.selectedOption,

            correct: a.correctAnswer,

            isCorrect: a.isCorrect,

            timeSpent: a.timeTakenInSeconds,

            skipReason: a.skipReason

        });

    });

    // =====================================
    // KPI
    // =====================================

    const attemptedQuestions =

        correctAnswers + wrongAnswers;

    const accuracy =

        (
            (correctAnswers / questions.length) * 100
        ).toFixed(2);

    const averageThinkingTime =

        (
            totalThinkingTime / questions.length
        ).toFixed(2);

    const confidenceScore =

        Math.max(

            0,

            100 -

            (
                skippedByTimeout * 15 +

                slowAnsweredQuestions * 5
            )
        );

    const hesitationScore =

        (
            (slowAnsweredQuestions / questions.length)
            * 100
        ).toFixed(2);

    const completionRate =

        (
            (attemptedQuestions / questions.length)
            * 100
        ).toFixed(2);

    // =====================================
    // CLUSTER PERFORMANCE
    // =====================================

    const easyPerformance =

        (
            (easyCorrect / 4) * 100
        ).toFixed(2);

    const moderatePerformance =

        (
            (moderateCorrect / 3) * 100
        ).toFixed(2);

    const hardPerformance =

        (
            (hardCorrect / 3) * 100
        ).toFixed(2);

    // =====================================
    // AI ANALYSIS
    // =====================================

    let behaviorAnalysis =
        "Balanced Performance";

    if(fastAnsweredQuestions >= 5){

        behaviorAnalysis =
            "Rapid Responder";
    }

    if(slowAnsweredQuestions >= 5){

        behaviorAnalysis =
            "Deliberate Analyzer";
    }

    // =====================================
    // REPORT DATA
    // =====================================

    const reportData = {

        name:
            document.getElementById("name").value,

        age:
            document.getElementById("age").value,

        profession:
            document.getElementById("profession").value,

        experience:
            document.getElementById("experience").value,

        email:
            document.getElementById("email").value,

        college:
            document.getElementById("college").value,

        department:
            document.getElementById("department").value,

        gender:
            document.getElementById("gender").value,

        score,

        totalQuestions:
            questions.length,

        correctAnswers,

        wrongAnswers,

        accuracy,

        confidenceScore,

        hesitationScore,

        completionRate,

        skippedByTimeout,

        skippedWithTimeRemaining,

        attemptedQuestions,

        totalThinkingTime,

        averageThinkingTime,

        fastAnsweredQuestions,

        slowAnsweredQuestions,

        easyPerformance,

        moderatePerformance,

        hardPerformance,

        behaviorAnalysis,

        questionAnalysis,

        answers: userAnswers,

        submittedAt:
            new Date()
    };

    // =====================================
    // SAVE TO DATABASE
    // =====================================

    try{

        const response = await fetch(

            "https://online-test-system-pqd0.onrender.com/save-result",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(reportData)
            }
        );

        const data =
            await response.json();

        console.log(data);

        document.getElementById(
            "testSection"
        ).style.display = "none";

        document.getElementById(
            "result"
        ).style.display = "block";

        document.getElementById(
            "scoreText"
        ).innerText =

            `${score} / ${questions.length}`;

    }

    catch(error){

        console.log(error);

        alert("Failed To Save Result");
    }
}