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

let currentQuestion = 0;

let userAnswers = new Array(questions.length).fill(null);

let questionStatus = new Array(questions.length).fill("not-visited");

let globalTime = 600;

let globalTimer = null;

// BLOCK RETEST

window.onload = function(){

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
                        font-size:22px;
                        line-height:1.8;
                    ">
                        You have already submitted your assessment.
                        <br><br>
                        Retest is not allowed.
                    </p>

                </div>

            </div>

        `;

    }

};

// START TEST

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

    // NAME VALIDATION

    if(name === ""){

        alert("Please enter your name");
        return;

    }

    if(name.length < 3){

        alert("Name must contain minimum 3 letters");
        return;

    }

    // AGE VALIDATION

    if(age === ""){

        alert("Please enter your age");
        return;

    }

    if(age < 15 || age > 80){

        alert("Age must be between 15 and 80");
        return;

    }

    // EMAIL VALIDATION

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Please enter valid email address");
        return;

    }

    // OTHER VALIDATIONS

    if(profession === ""){

        alert("Please enter profession");
        return;

    }

    if(experience === ""){

        alert("Please enter experience");
        return;

    }

    if(college === ""){

        alert("Please enter college name");
        return;

    }

    if(department === ""){

        alert("Please enter department");
        return;

    }

    // SHOW INSTRUCTION PAGE

    document.getElementById(
        "registrationForm"
    ).style.display = "none";

    document.getElementById(
        "instructionPage"
    ).style.display = "block";

}

// BEGIN ACTUAL TEST

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

// START GLOBAL TIMER

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
                ? "0" + seconds
                : seconds
            }`;

        if(globalTime <= 0){

            clearInterval(globalTimer);

            finishTest();

        }

    },1000);

}

// LOAD QUESTION

function loadQuestion(){

    const q = questions[currentQuestion];

    // QUESTION TITLE

    document.getElementById(
        "questionTitle"
    ).innerHTML = q.question;

    // QUESTION IMAGE

    document.getElementById(
        "questionImage"
    ).src = q.image;

    // CURRENT STATUS

    if(questionStatus[currentQuestion] === "not-visited"){

        questionStatus[currentQuestion] = "current";

    }

    // OPTIONS

    let optionsHTML = "";

    q.options.forEach(option => {

        const checked =

            userAnswers[currentQuestion]
            &&
            userAnswers[currentQuestion].selectedOption === option

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
                    font-size:22px;
                ">
                    ${option}
                </div>

            </label>

        `;

    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML = optionsHTML;

    // UPDATE STATUS PANEL

    updateQuestionStatus();

    // PREVIOUS BUTTON

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

// SELECT ANSWER

function selectAnswer(answer){

    userAnswers[currentQuestion] = {

        question:
            questions[currentQuestion].question,

        selectedOption:
            answer,

        correctAnswer:
            questions[currentQuestion].answer,

        isCorrect:
            answer ===
            questions[currentQuestion].answer

    };

    questionStatus[currentQuestion] = "answered";

    updateQuestionStatus();

}

// UPDATE QUESTION STATUS

function updateQuestionStatus(){

    let html = "";

    for(let i = 0; i < questions.length; i++){

        let statusClass = "not-visited";

        if(i === currentQuestion){

            statusClass = "current";

        }

        else if(userAnswers[i]){

            statusClass = "answered";

        }

        else if(questionStatus[i] === "not-visited"){

            statusClass = "not-visited";

        }

        else{

            statusClass = "not-answered";

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

// GO TO QUESTION

function goToQuestion(index){

    if(
        !userAnswers[currentQuestion]
        &&
        questionStatus[currentQuestion] !== "answered"
    ){

        questionStatus[currentQuestion] = "not-answered";

    }

    currentQuestion = index;

    loadQuestion();

}

// NEXT QUESTION

function nextQuestion(){

    // LAST QUESTION

    if(currentQuestion === questions.length - 1){

        finishTest();
        return;

    }

    // NOT ANSWERED

    if(!userAnswers[currentQuestion]){

        questionStatus[currentQuestion] = "not-answered";

    }

    currentQuestion++;

    loadQuestion();

}

// PREVIOUS QUESTION

function previousQuestion(){

    if(currentQuestion > 0){

        currentQuestion--;

        loadQuestion();

    }

}

// FINISH TEST

function finishTest(){

    clearInterval(globalTimer);

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

        correctAnswers: score,

        wrongAnswers:
            questions.length - score,

        answers: userAnswers

    };

    // SAVE LOCAL REPORT

    localStorage.setItem(
        "testReport",
        JSON.stringify(reportData)
    );

    // BLOCK RETEST

    localStorage.setItem(
        "testCompleted",
        "true"
    );

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

    // SAVE DATABASE

    fetch(
        "https://online-test-system-pqd0.onrender.com/save-result",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
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

    )
    .then(response => response.json())
    .then(data => {

        console.log("Saved Successfully");

    })
    .catch(error => {

        console.log("Save Error", error);

    });

    // BLOCK BACK BUTTON

    history.pushState(
        null,
        null,
        location.href
    );

    window.onpopstate = function(){

        history.go(1);

    };

    // REDIRECT REPORT PAGE

    setTimeout(() => {

        window.location.href = "report.html";

    },1000);

}