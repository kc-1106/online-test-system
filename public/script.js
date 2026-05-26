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

/* ===========================
   VARIABLES
=========================== */

let currentQuestion = 0;

let userAnswers =
    new Array(questions.length).fill(null);

let globalTime = 600;

let globalTimer;

let questionTime = 60;

let questionTimer;

/* ===========================
   BLOCK RETEST
=========================== */

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

                <h1 style="
                    font-size:45px;
                    margin-bottom:20px;
                ">
                    Test Already Completed
                </h1>

                <p style="
                    font-size:24px;
                ">
                    Retest is not allowed.
                </p>

            </div>

        </div>

    `;

}

/* ===========================
   START TEST
=========================== */

function startTest(){

    const name =
        document.getElementById("name")
        .value.trim();

    const age =
        document.getElementById("age")
        .value.trim();

    const profession =
        document.getElementById("profession")
        .value.trim();

    const experience =
        document.getElementById("experience")
        .value.trim();

    const email =
        document.getElementById("email")
        .value.trim();

    const college =
        document.getElementById("college")
        .value.trim();

    const department =
        document.getElementById("department")
        .value.trim();

    if(name === ""){

        alert("Enter Name");
        return;

    }

    if(age === ""){

        alert("Enter Age");
        return;

    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Invalid Email");
        return;

    }

    if(profession === ""){

        alert("Enter Profession");
        return;

    }

    if(experience === ""){

        alert("Enter Experience");
        return;

    }

    if(college === ""){

        alert("Enter College");
        return;

    }

    if(department === ""){

        alert("Enter Department");
        return;

    }

    document.getElementById(
        "registrationForm"
    ).style.display = "none";

    document.getElementById(
        "instructionPage"
    ).style.display = "block";

}

/* ===========================
   BEGIN ACTUAL TEST
=========================== */

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

/* ===========================
   GLOBAL TIMER
=========================== */

function startGlobalTimer(){

    clearInterval(globalTimer);

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

/* ===========================
   LOCAL QUESTION TIMER
=========================== */

function startQuestionTimer(){

    clearInterval(questionTimer);

    questionTime = 60;

    document.getElementById(
        "timer"
    ).innerHTML =

        "Question Time Left : 60 sec";

    questionTimer = setInterval(() => {

        questionTime--;

        document.getElementById(
            "timer"
        ).innerHTML =

            "Question Time Left : "
            + questionTime
            + " sec";

        if(questionTime <= 0){

            clearInterval(questionTimer);

            nextQuestion();

        }

    },1000);

}

/* ===========================
   LOAD QUESTION
=========================== */

function loadQuestion(){

    startQuestionTimer();

    const q = questions[currentQuestion];

    document.getElementById(
        "questionTitle"
    ).innerHTML =
        q.question;

    document.getElementById(
        "questionImage"
    ).src =
        q.image;

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

                <div style="
                    margin-top:10px;
                ">
                    ${option}
                </div>

            </label>

        `;

    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML =
        optionsHTML;

    updateQuestionStatus();

    /* PREVIOUS BUTTON */

    if(currentQuestion === 0){

        document.getElementById(
            "prevBtn"
        ).disabled = true;

    }

    else{

        document.getElementById(
            "prevBtn"
        ).disabled = false;

    }

    /* FINISH BUTTON */

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

/* ===========================
   SELECT ANSWER
=========================== */
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

    // MARK ANSWERED

    questionStatus[currentQuestion] =
        "answered";

    updateQuestionStatus();

}

/* ===========================
   UPDATE QUESTION STATUS
=========================== */

// UPDATE QUESTION STATUS

function updateQuestionStatus(){

    let html = "";

    for(let i = 0; i < questions.length; i++){

        let statusClass = "";

        // CURRENT QUESTION

        if(i === currentQuestion){

            statusClass = "current";

        }

        // ANSWERED

        else if(
            userAnswers[i] &&
            userAnswers[i].selectedOption !== "Not Answered"
        ){

            statusClass = "answered";

        }

        // VISITED BUT NOT ANSWERED

        else if(questionStatus[i] === "visited"){

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

/* ===========================
   GO TO QUESTION
=========================== */

function goToQuestion(index){

    currentQuestion = index;

    loadQuestion();

}

/* ===========================
   NEXT QUESTION
=========================== */

function nextQuestion(){

    clearInterval(questionTimer);

    if(currentQuestion === questions.length - 1){

        finishTest();

        return;

    }

    currentQuestion++;

    loadQuestion();

}

/* ===========================
   PREVIOUS QUESTION
=========================== */

function previousQuestion(){

    clearInterval(questionTimer);

    if(currentQuestion > 0){

        currentQuestion--;

        loadQuestion();

    }

}

/* ===========================
   FINISH TEST
=========================== */

function finishTest(){

    clearInterval(globalTimer);

    clearInterval(questionTimer);

    let score = 0;

    userAnswers.forEach(answer => {

        if(answer && answer.isCorrect){

            score++;

        }

    });

    const reportData = {

        name:
            document.getElementById("name").value,

        email:
            document.getElementById("email").value,

        score: score,

        totalQuestions:
            questions.length,

        answers: userAnswers

    };

    localStorage.setItem(
        "testReport",
        JSON.stringify(reportData)
    );

    localStorage.setItem(
        "testCompleted",
        "true"
    );

    fetch(
        "https://online-test-system-pqd0.onrender.com/save-result",

        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

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

                score: score,

                totalQuestions:
                    questions.length,

                answers: userAnswers

            })

        }

    );

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

    setTimeout(() => {

        window.location.href =
            "report.html";

    },2000);

}