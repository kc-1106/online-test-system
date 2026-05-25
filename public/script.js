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

let userAnswers =
    new Array(questions.length).fill(null);

let questionStatus =
    new Array(questions.length)
    .fill("not-visited");

let questionStartTime;

let globalTime = 600;

let globalTimer;

// BLOCK TEST AFTER COMPLETION

if(localStorage.getItem("testCompleted") === "true"){

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            document.body.innerHTML = `

            <div style="
                height:100vh;
                display:flex;
                justify-content:center;
                align-items:center;
                background:#0f172a;
                color:white;
                font-family:Arial;
                text-align:center;
                padding:30px;
            ">

                <div>

                    <h1 style="
                        font-size:45px;
                        margin-bottom:25px;
                    ">
                        Test Already Completed
                    </h1>

                    <p style="
                        font-size:22px;
                        line-height:1.8;
                    ">

                        You have already submitted
                        your assessment.

                        <br><br>

                        Retest is not allowed.

                    </p>

                </div>

            </div>

            `;

        }
    );

}

// START TEST

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

    // NAME VALIDATION

    if(name === ""){

        alert("Please enter your name");
        return;

    }

    if(name.length < 3){

        alert(
            "Name must contain minimum 3 letters"
        );

        return;

    }

    // AGE VALIDATION

    if(age === ""){

        alert("Please enter your age");
        return;

    }

    if(age < 15 || age > 80){

        alert(
            "Age must be between 15 and 80"
        );

        return;

    }

    // EMAIL VALIDATION

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert(
            "Please enter valid email address"
        );

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

    // HIDE REGISTRATION

    document.getElementById(
        "registrationForm"
    ).style.display = "none";

    // SHOW INSTRUCTION

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

    // USER DETAILS TOP PANEL

    document.getElementById(
        "displayName"
    ).innerHTML =
        document.getElementById("name").value;

    document.getElementById(
        "displayEmail"
    ).innerHTML =
        document.getElementById("email").value;

    createQuestionPalette();

    startGlobalTimer();

    loadQuestion();

}

// CREATE QUESTION STATUS

function createQuestionPalette(){

    let html = "";

    for(let i=0;i<questions.length;i++){

        html += `

        <div
            class="question-circle"
            id="circle-${i}"
            onclick="jumpToQuestion(${i})"
        >
            ${i+1}
        </div>

        `;

    }

    document.getElementById(
        "questionPalette"
    ).innerHTML = html;

    updateQuestionPalette();

}

// UPDATE STATUS COLORS

function updateQuestionPalette(){

    for(let i=0;i<questions.length;i++){

        const circle =
            document.getElementById(
                `circle-${i}`
            );

        circle.className =
            "question-circle";

        if(i === currentQuestion){

            circle.classList.add(
                "processing"
            );

        }

        else if(
            userAnswers[i] &&
            userAnswers[i].selectedOption !==
            "Not Answered"
        ){

            circle.classList.add(
                "answered"
            );

        }

        else if(userAnswers[i]){

            circle.classList.add(
                "not-answered"
            );

        }

        else{

            circle.classList.add(
                "not-visited"
            );

        }

    }

}

// GLOBAL TIMER

function startGlobalTimer(){

    globalTimer = setInterval(() => {

        let minutes =
            Math.floor(globalTime / 60);

        let seconds =
            globalTime % 60;

        if(seconds < 10){

            seconds = "0" + seconds;

        }

        document.getElementById(
            "globalTimer"
        ).innerHTML =
            minutes + ":" + seconds;

        globalTime--;

        if(globalTime < 0){

            clearInterval(globalTimer);

            finishTest();

        }

    },1000);

}

// LOAD QUESTION

function loadQuestion(){

    questionStartTime = new Date();

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

            ${option}

        </label>

        `;

    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML =
        optionsHTML;

    // BUTTON TEXT

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

    updateQuestionPalette();

}

// SELECT ANSWER

function selectAnswer(answer){

    const timeTaken =

        Math.floor(
            (
                new Date()
                -
                questionStartTime
            ) / 1000
        );

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
            timeTaken

    };

    updateQuestionPalette();

}

// NEXT QUESTION

function nextQuestion(){

    // SAVE EMPTY ANSWER

    if(
        userAnswers[currentQuestion]
        == null
    ){

        const timeTaken =

            Math.floor(
                (
                    new Date()
                    -
                    questionStartTime
                ) / 1000
            );

        userAnswers[currentQuestion] = {

            question:
                questions[currentQuestion]
                .question,

            image:
                questions[currentQuestion]
                .image,

            selectedOption:
                "Not Answered",

            correctAnswer:
                questions[currentQuestion]
                .answer,

            isCorrect:false,

            timeTakenInSeconds:
                timeTaken

        };

    }

    // LAST QUESTION

    if(currentQuestion === questions.length - 1){

        finishTest();

        return;

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

// JUMP QUESTION

function jumpToQuestion(index){

    currentQuestion = index;

    loadQuestion();

}

// FINISH TEST

async function finishTest(){

    clearInterval(globalTimer);

    let score = 0;

    let totalTime = 0;

    userAnswers.forEach(answer => {

        if(answer && answer.isCorrect){

            score++;

        }

        if(answer){

            totalTime +=
                answer.timeTakenInSeconds;

        }

    });

    const reportData = {

        name:
            document.getElementById("name")
            .value,

        email:
            document.getElementById("email")
            .value,

        score: score,

        totalQuestions:
            questions.length,

        correctAnswers:
            score,

        wrongAnswers:
            questions.length - score,

        accuracy:
            (
                (
                    score /
                    questions.length
                ) * 100
            ).toFixed(2),

        totalTime:
            totalTime,

        answers:
            userAnswers

    };

    // SAVE REPORT

    localStorage.setItem(
        "testReport",
        JSON.stringify(reportData)
    );

    localStorage.setItem(
        "testCompleted",
        "true"
    );

    // SAVE DATABASE

    try{

        await fetch(

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

                    answers:
                        userAnswers

                })

            }

        );

    }catch(error){

        console.log(error);

    }

    // BLOCK BACK

    history.pushState(
        null,
        null,
        location.href
    );

    window.onpopstate = function(){

        history.go(1);

    };

    // REDIRECT

    window.location.href =
        "report.html";

}