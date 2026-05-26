const questions = [

    {
        question: "Question 1",
        image: "images/q1.png",
        options: ["A","B","C","D","E"],
        answer: "C"
    },

    {
        question: "Question 2",
        image: "images/q2.png",
        options: ["A","B","C","D","E"],
        answer: "E"
    },

    {
        question: "Question 3",
        image: "images/q3.png",
        options: ["A","B","C","D","E"],
        answer: "E"
    },

    {
        question: "Question 4",
        image: "images/q4.png",
        options: ["A","B","C","D","E"],
        answer: "E"
    },

    {
        question: "Question 5",
        image: "images/q5.png",
        options: ["A","B","C","D","E"],
        answer: "D"
    },

    {
        question: "Question 6",
        image: "images/q6.png",
        options: ["A","B","C","D","E"],
        answer: "E"
    },

    {
        question: "Question 7",
        image: "images/q7.png",
        options: ["A","B","C","D","E"],
        answer: "E"
    },

    {
        question: "Question 8",
        image: "images/q8.png",
        options: ["A","B","C","D","E"],
        answer: "B"
    },

    {
        question: "Question 9",
        image: "images/q9.png",
        options: ["A","B","C","D","E"],
        answer: "D"
    },

    {
        question: "Question 10",
        image: "images/q10.png",
        options: ["A","B","C","D","E"],
        answer: "C"
    }

];

// =========================
// VARIABLES
// =========================

let currentQuestion = 0;

let userAnswers =
    new Array(questions.length).fill(null);

let questionStatus =
    new Array(questions.length)
    .fill("not-visited");

// TIMER FOR EACH QUESTION

let questionTimers =
    new Array(questions.length).fill(60);

let localTimer;

let localTime = 60;

// GLOBAL TIMER

let globalTime = 600;

let globalTimer;

// =========================
// BLOCK RETEST
// =========================

if(localStorage.getItem("testCompleted") === "true"){

    document.body.innerHTML = `

        <div style="
            height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            background:#0f172a;
            color:white;
            font-family:Arial;
        ">

            <div style="text-align:center;">

                <h1 style="font-size:45px;">
                    Test Already Completed
                </h1>

                <p style="
                    margin-top:20px;
                    font-size:22px;
                ">
                    Retest is not allowed.
                </p>

            </div>

        </div>

    `;

}

// =========================
// START TEST
// =========================

function startTest(){

    const name =
        document.getElementById("name").value.trim();

    const age =
        document.getElementById("age").value.trim();

    const profession =
        document.getElementById("profession").value.trim();

    const experience =
        document.getElementById("experience").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const college =
        document.getElementById("college").value.trim();

    const department =
        document.getElementById("department").value.trim();

    if(name === ""){

        alert("Please enter name");
        return;

    }

    if(age === ""){

        alert("Please enter age");
        return;

    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Please enter valid email");
        return;

    }

    if(profession === ""){

        alert("Please enter profession");
        return;

    }

    if(experience === ""){

        alert("Please enter experience");
        return;

    }

    if(college === ""){

        alert("Please enter college");
        return;

    }

    if(department === ""){

        alert("Please enter department");
        return;

    }

    document.getElementById(
        "registrationForm"
    ).style.display = "none";

    document.getElementById(
        "instructionPage"
    ).style.display = "block";

}

// =========================
// BEGIN TEST
// =========================

function beginActualTest(){

    document.getElementById(
        "instructionPage"
    ).style.display = "none";

    document.getElementById(
        "testSection"
    ).style.display = "block";

    document.getElementById(
        "displayUserName"
    ).innerHTML =
        document.getElementById("name").value;

    document.getElementById(
        "displayUserEmail"
    ).innerHTML =
        document.getElementById("email").value;

    startGlobalTimer();

    loadQuestion();

}

// =========================
// GLOBAL TIMER
// =========================

function startGlobalTimer(){

    globalTimer = setInterval(() => {

        globalTime--;

        const minutes =
            Math.floor(globalTime / 60);

        const seconds =
            globalTime % 60;

        document.getElementById(
            "globalTimer"
        ).innerHTML =

            `${minutes}:${
                seconds < 10
                ? "0"+seconds
                : seconds
            }`;

        if(globalTime <= 0){

            clearInterval(globalTimer);

            finishTest();

        }

    },1000);

}

// =========================
// LOCAL TIMER
// =========================

function startLocalTimer(){

    clearInterval(localTimer);

    // LOAD SAVED TIME

    localTime =
        questionTimers[currentQuestion];

    document.getElementById(
        "timer"
    ).innerHTML = localTime;

    localTimer = setInterval(() => {

        localTime--;

        // SAVE CURRENT TIMER

        questionTimers[currentQuestion] =
            localTime;

        document.getElementById(
            "timer"
        ).innerHTML = localTime;

        // AUTO NEXT

        if(localTime <= 0){

            clearInterval(localTimer);

            if(!userAnswers[currentQuestion]){

                questionStatus[currentQuestion] =
                    "not-answered";

            }

            updateQuestionStatus();

            nextQuestion();

        }

    },1000);

}

// =========================
// LOAD QUESTION
// =========================

function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById(
        "questionTitle"
    ).innerHTML = q.question;

    document.getElementById(
        "questionImage"
    ).src = q.image;

    let optionsHTML = "";

    q.options.forEach(option => {

        const checked =

            userAnswers[currentQuestion]
            &&
            userAnswers[currentQuestion]
            .selectedOption === option

            ? "checked"
            : "";

        optionsHTML += `

            <label class="option">

                <input
                    type="radio"
                    name="option"
                    value="${option}"
                    ${checked}
                    onchange="selectAnswer('${option}')"
                >

                <div style="margin-top:10px;">
                    ${option}
                </div>

            </label>

        `;

    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML = optionsHTML;

    // START TIMER

    startLocalTimer();

    // UPDATE STATUS

    updateQuestionStatus();

    // PREVIOUS BUTTON

    document.getElementById(
        "prevBtn"
    ).disabled =
        currentQuestion === 0;

    // FINISH BUTTON

    if(currentQuestion === questions.length - 1){

        document.getElementById(
            "nextBtn"
        ).innerHTML = "Finish Test";

    }

    else{

        document.getElementById(
            "nextBtn"
        ).innerHTML = "Next Question";

    }

}

// =========================
// SELECT ANSWER
// =========================

function selectAnswer(answer){

    userAnswers[currentQuestion] = {

        question:
            questions[currentQuestion].question,

        image:
            questions[currentQuestion].image,

        selectedOption:
            answer,

        correctAnswer:
            questions[currentQuestion].answer,

        isCorrect:
            answer ===
            questions[currentQuestion].answer

    };

    questionStatus[currentQuestion] =
        "answered";

    updateQuestionStatus();

}

// =========================
// UPDATE QUESTION STATUS
// =========================

function updateQuestionStatus(){

    let html = "";

    for(let i = 0; i < questions.length; i++){

        let statusClass = "";

        // CURRENT

        if(i === currentQuestion){

            statusClass = "current";

        }

        // ANSWERED

        else if(
            userAnswers[i] &&
            userAnswers[i].selectedOption
        ){

            statusClass = "answered";

        }

        // NOT ANSWERED

        else if(
            questionStatus[i] === "not-answered"
        ){

            statusClass = "not-answered";

        }

        // NOT VISITED

        else{

            statusClass = "not-visited";

        }

        html += `

            <div
                class="status-circle ${statusClass}"
                onclick="goToQuestion(${i})"
            >

                ${i + 1}

            </div>

        `;
    }

    document.getElementById(
        "questionStatusContainer"
    ).innerHTML = html;

}

// =========================
// GO TO QUESTION
// =========================

function goToQuestion(index){

    clearInterval(localTimer);

    // SAVE TIMER

    questionTimers[currentQuestion] =
        localTime;

    // MARK RED

    if(!userAnswers[currentQuestion]){

        questionStatus[currentQuestion] =
            "not-answered";

    }

    currentQuestion = index;

    loadQuestion();

}

// =========================
// NEXT QUESTION
// =========================

function nextQuestion(){

    clearInterval(localTimer);

    // SAVE TIMER

    questionTimers[currentQuestion] =
        localTime;

    // MARK RED

    if(!userAnswers[currentQuestion]){

        questionStatus[currentQuestion] =
            "not-answered";

    }

    // FINISH

    if(currentQuestion === questions.length - 1){

        finishTest();

        return;

    }

    currentQuestion++;

    loadQuestion();

}

// =========================
// PREVIOUS QUESTION
// =========================

function previousQuestion(){

    clearInterval(localTimer);

    // SAVE TIMER

    questionTimers[currentQuestion] =
        localTime;

    // MARK RED

    if(!userAnswers[currentQuestion]){

        questionStatus[currentQuestion] =
            "not-answered";

    }

    if(currentQuestion > 0){

        currentQuestion--;

        loadQuestion();

    }

}

// =========================
// FINISH TEST
// =========================



}// FINISH TEST

function finishTest(){

    clearInterval(globalTimer);

    clearInterval(questionTimer);

    let score = 0;

    let correctAnswers = 0;

    let wrongAnswers = 0;

    let skippedByTimeout = 0;

    let skippedWithTimeRemaining = 0;

    let attemptedQuestions = 0;

    let totalThinkingTime = 0;

    let fastAnsweredQuestions = 0;

    let slowAnsweredQuestions = 0;

    let questionAnalysis = [];

    userAnswers.forEach((answer,index) => {

        // QUESTION NEVER VISITED

        if(answer == null){

            skippedWithTimeRemaining++;

            questionAnalysis.push({

                questionNumber:index + 1,

                status:"Not Visited",

                selectedOption:"None",

                correctAnswer:
                    questions[index].answer,

                isCorrect:false,

                thinkingTime:0

            });

            return;

        }

        // TOTAL TIME

        totalThinkingTime +=
            answer.timeTakenInSeconds;

        // ATTEMPTED

        if(

            answer.selectedOption !==
            "Not Answered"

        ){

            attemptedQuestions++;

        }

        // CORRECT / WRONG

        if(answer.isCorrect){

            score++;

            correctAnswers++;

        }

        else{

            if(

                answer.selectedOption !==
                "Not Answered"

            ){

                wrongAnswers++;

            }

        }

        // SKIPPED TYPES

        if(

            answer.selectedOption ===
            "Not Answered"

        ){

            if(answer.skipReason === "timeout"){

                skippedByTimeout++;

            }

            else{

                skippedWithTimeRemaining++;

            }

        }

        // FAST / SLOW ANALYSIS

        if(

            answer.timeTakenInSeconds <= 15

        ){

            fastAnsweredQuestions++;

        }

        if(

            answer.timeTakenInSeconds >= 40

        ){

            slowAnsweredQuestions++;

        }

        // QUESTION ANALYSIS

        questionAnalysis.push({

            questionNumber:index + 1,

            status:
                answer.selectedOption ===
                "Not Answered"

                ? "Skipped"

                : "Answered",

            selectedOption:
                answer.selectedOption,

            correctAnswer:
                answer.correctAnswer,

            isCorrect:
                answer.isCorrect,

            thinkingTime:
                answer.timeTakenInSeconds,

            skipReason:
                answer.skipReason || "none"

        });

    });

    // ACCURACY

    const accuracy = (

        (correctAnswers / questions.length) * 100

    ).toFixed(2);

    // AVERAGE THINKING TIME

    const averageThinkingTime = (

        totalThinkingTime / questions.length

    ).toFixed(2);

    // ATTEMPTED ALL QUESTIONS

    const attemptedAllQuestions =

        attemptedQuestions === questions.length;

    // BEHAVIOR ANALYSIS

    let behavior = "";

    if(fastAnsweredQuestions >= 7){

        behavior =
            "Fast Decision Maker";

    }

    else if(slowAnsweredQuestions >= 7){

        behavior =
            "Slow Analytical Thinker";

    }

    else{

        behavior =
            "Balanced Thinker";

    }

    // FINAL REPORT OBJECT

    const reportData = {

        // USER DETAILS

        name:
            document.getElementById("name").value,

        email:
            document.getElementById("email").value,

        age:
            document.getElementById("age").value,

        profession:
            document.getElementById("profession").value,

        experience:
            document.getElementById("experience").value,

        college:
            document.getElementById("college").value,

        department:
            document.getElementById("department").value,

        // SCORE DATA

        score:score,

        totalQuestions:
            questions.length,

        correctAnswers:
            correctAnswers,

        wrongAnswers:
            wrongAnswers,

        accuracy:
            accuracy,

        // SKIP ANALYSIS

        skippedByTimeout:
            skippedByTimeout,

        skippedWithTimeRemaining:
            skippedWithTimeRemaining,

        // ATTEMPT ANALYSIS

        attemptedQuestions:
            attemptedQuestions,

        attemptedAllQuestions:
            attemptedAllQuestions,

        // TIME ANALYSIS

        totalThinkingTime:
            totalThinkingTime,

        averageThinkingTime:
            averageThinkingTime,

        fastAnsweredQuestions:
            fastAnsweredQuestions,

        slowAnsweredQuestions:
            slowAnsweredQuestions,

        // USER BEHAVIOR

        behaviorAnalysis:
            behavior,

        // QUESTION DETAILS

        questionAnalysis:
            questionAnalysis,

        // RAW ANSWERS

        answers:userAnswers,

        submittedAt:
            new Date()

    };

    // SAVE LOCAL STORAGE

    localStorage.setItem(

        "testReport",

        JSON.stringify(reportData)

    );

    // BLOCK RETEST

    localStorage.setItem(

        "testCompleted",

        "true"

    );

    // SAVE TO DATABASE

    fetch(

        "https://online-test-system-pqd0.onrender.com/save-result",

        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify(reportData)

        }

    )

    .then(response => response.json())

    .then(data => {

        console.log(data);

    })

    .catch(error => {

        console.log(error);

    });

    // SHOW RESULT PAGE

    document.getElementById(
        "testSection"
    ).style.display = "none";

    document.getElementById(
        "result"
    ).style.display = "block";

    document.getElementById(
        "scoreText"
    ).innerHTML =

        score + " / " + questions.length;

    // REDIRECT TO REPORT PAGE

    setTimeout(() => {

        window.location.href =
            "report.html";

    },3000);

}