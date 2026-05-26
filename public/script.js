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

// ====================================
// VARIABLES
// ====================================

let currentQuestion = 0;

let userAnswers =
    new Array(questions.length).fill(null);

let questionStatus =
    new Array(questions.length)
    .fill("not-visited");

let questionTimers =
    new Array(questions.length).fill(60);

let localTimer;

let localTime = 60;

let globalTime = 600;

let globalTimer;

// ====================================
// BLOCK RETEST
// ====================================

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

// ====================================
// START TEST
// ====================================

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

// ====================================
// BEGIN TEST
// ====================================

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

// ====================================
// GLOBAL TIMER
// ====================================

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

// ====================================
// LOCAL TIMER
// ====================================

function startLocalTimer(){

    clearInterval(localTimer);

    localTime =
        questionTimers[currentQuestion];

    document.getElementById(
        "timer"
    ).innerHTML = localTime;

    localTimer = setInterval(() => {

        localTime--;

        questionTimers[currentQuestion] =
            localTime;

        document.getElementById(
            "timer"
        ).innerHTML = localTime;

        if(localTime <= 0){

            clearInterval(localTimer);

            if(!userAnswers[currentQuestion]){

                saveSkippedAnswer("timeout");

            }

            nextQuestion();

        }

    },1000);

}

// ====================================
// LOAD QUESTION
// ====================================

function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById(
        "questionTitle"
    ).innerHTML = q.question;

    document.getElementById(
        "questionImage"
    ).src = q.image;

    if(
        questionStatus[currentQuestion] ===
        "not-visited"
    ){

        questionStatus[currentQuestion] =
            "current";

    }

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

    updateQuestionStatus();

    startLocalTimer();

    document.getElementById(
        "prevBtn"
    ).disabled =
        currentQuestion === 0;

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

// ====================================
// SELECT ANSWER
// ====================================

function selectAnswer(answer){

    const timeTaken =
        60 - questionTimers[currentQuestion];

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
            questions[currentQuestion].answer,

        timeTakenInSeconds:
            timeTaken,

        skipReason:"none"

    };

    questionStatus[currentQuestion] =
        "answered";

    updateQuestionStatus();

}

// ====================================
// SAVE SKIPPED
// ====================================

function saveSkippedAnswer(reason){

    const timeTaken =
        60 - questionTimers[currentQuestion];

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
            timeTaken,

        skipReason:reason

    };

    questionStatus[currentQuestion] =
        "not-answered";

}

// ====================================
// UPDATE QUESTION STATUS
// ====================================

function updateQuestionStatus(){

    let html = "";

    for(let i=0;i<questions.length;i++){

        let statusClass = "";

        if(i === currentQuestion){

            statusClass = "current";

        }

        else if(
            userAnswers[i] &&
            userAnswers[i].selectedOption !==
            "Not Answered"
        ){

            statusClass = "answered";

        }

        else if(
            questionStatus[i] ===
            "not-answered"
        ){

            statusClass = "not-answered";

        }

        else{

            statusClass = "not-visited";

        }

        html += `

            <div
                class="status-circle ${statusClass}"
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

// ====================================
// GO TO QUESTION
// ====================================

function goToQuestion(index){

    clearInterval(localTimer);

    questionTimers[currentQuestion] =
        localTime;

    if(!userAnswers[currentQuestion]){

        questionStatus[currentQuestion] =
            "not-answered";

    }

    currentQuestion = index;

    loadQuestion();

}

// ====================================
// NEXT QUESTION
// ====================================

function nextQuestion(){

    clearInterval(localTimer);

    questionTimers[currentQuestion] =
        localTime;

    if(!userAnswers[currentQuestion]){

        saveSkippedAnswer(
            localTime <= 0
            ? "timeout"
            : "manual-skip"
        );

    }

    if(currentQuestion === questions.length - 1){

        finishTest();

        return;

    }

    currentQuestion++;

    loadQuestion();

}

// ====================================
// PREVIOUS QUESTION
// ====================================

function previousQuestion(){

    clearInterval(localTimer);

    questionTimers[currentQuestion] =
        localTime;

    if(!userAnswers[currentQuestion]){

        questionStatus[currentQuestion] =
            "not-answered";

    }

    if(currentQuestion > 0){

        currentQuestion--;

        loadQuestion();

    }

}

// ====================================
// FINISH TEST
// ====================================

function finishTest(){

    clearInterval(globalTimer);

    clearInterval(localTimer);

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

        if(answer == null){

            skippedWithTimeRemaining++;

            return;

        }

        totalThinkingTime +=
            answer.timeTakenInSeconds;

        if(
            answer.selectedOption !==
            "Not Answered"
        ){

            attemptedQuestions++;

        }

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

        if(
            answer.selectedOption ===
            "Not Answered"
        ){

            if(
                answer.skipReason ===
                "timeout"
            ){

                skippedByTimeout++;

            }

            else{

                skippedWithTimeRemaining++;

            }

        }

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

        questionAnalysis.push({

            questionNumber:index + 1,

            selectedOption:
                answer.selectedOption,

            correctAnswer:
                answer.correctAnswer,

            isCorrect:
                answer.isCorrect,

            thinkingTime:
                answer.timeTakenInSeconds,

            skipReason:
                answer.skipReason

        });

    });

    const accuracy = (

        (correctAnswers / questions.length) * 100

    ).toFixed(2);

    const averageThinkingTime = (

        totalThinkingTime / questions.length

    ).toFixed(2);

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

        score:score,

        totalQuestions:
            questions.length,

        correctAnswers:
            correctAnswers,

        wrongAnswers:
            wrongAnswers,

        accuracy:
            accuracy,

        skippedByTimeout:
            skippedByTimeout,

        skippedWithTimeRemaining:
            skippedWithTimeRemaining,

        attemptedQuestions:
            attemptedQuestions,

        totalThinkingTime:
            totalThinkingTime,

        averageThinkingTime:
            averageThinkingTime,

        fastAnsweredQuestions:
            fastAnsweredQuestions,

        slowAnsweredQuestions:
            slowAnsweredQuestions,

        behaviorAnalysis:
            behavior,

        questionAnalysis:
            questionAnalysis,

        answers:userAnswers,

        submittedAt:
            new Date()

    };

    // SAVE LOCAL

    localStorage.setItem(
        "testReport",
        JSON.stringify(reportData)
    );

    localStorage.setItem(
        "testCompleted",
        "true"
    );

    // SAVE DATABASE

    fetch(

        "https://online-test-system-pqd0.onrender.com/save-resultonrender",

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(reportData)

        }

    )
    .then(response => response.json())
    .then(data => {

        console.log("Saved :",data);

    })
    .catch(error => {

        console.log("Save Error :",error);

    });

    // SHOW RESULT

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

    // REDIRECT

    setTimeout(() => {

        window.location.href =
            "report.html";

    },3000);

}