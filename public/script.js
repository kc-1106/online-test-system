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

let questionTime = 60;

let timer;

let questionStartTime;

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

    const fields = [

        "name",
        "age",
        "profession",
        "experience",
        "email",
        "college",
        "department"

    ];

    for(let field of fields){

        if(

            document.getElementById(field)
            .value
            .trim() === ""

        ){

            alert("Please fill all fields");

            return;

        }

    }

    document.getElementById(
        "registrationForm"
    ).style.display = "none";

    document.getElementById(
        "instructionPage"
    ).style.display = "block";

}

// BEGIN TEST
function beginActualTest(){

    if(localStorage.getItem("testCompleted")){

        alert(
            "You have already completed the test."
        );

        return;

    }

    document.getElementById(
        "instructionPage"
    ).style.display = "none";

    document.getElementById(
        "testSection"
    ).style.display = "block";

    loadQuestion();

}

// LOAD QUESTION
function loadQuestion(){

    clearInterval(timer);

    questionTime = 60;

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
    ).innerHTML = optionsHTML;

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

    startQuestionTimer();

}

// TIMER
function startQuestionTimer(){

    document.getElementById(
        "timer"
    ).innerHTML =

        "Time Left : "
        + questionTime
        + " sec";

    timer = setInterval(() => {

        questionTime--;

        document.getElementById(
            "timer"
        ).innerHTML =

            "Time Left : "
            + questionTime
            + " sec";

        if(questionTime <= 0){

            clearInterval(timer);

            nextQuestion();

        }

    },1000);

}

// SELECT ANSWER
function selectAnswer(answer){

    const timeTaken =

        (
            new Date()
            -
            questionStartTime
        ) / 1000;

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
            Math.floor(timeTaken)

    };

}

// NEXT QUESTION
function nextQuestion(){

    if(

        userAnswers[currentQuestion]
        == null

    ){

        const timeTaken =

            (
                new Date()
                -
                questionStartTime
            ) / 1000;

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
                Math.floor(timeTaken)

        };

    }

    currentQuestion++;

    if(currentQuestion < questions.length){

        loadQuestion();

    }

    else{

        finishTest();

    }

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

    clearInterval(timer);

    let score = 0;

    let totalTime = 0;

    userAnswers.forEach(answer => {

        if(answer.isCorrect){

            score++;

        }

        totalTime +=
            answer.timeTakenInSeconds;

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

        accuracy:

            (
                (score / questions.length) * 100
            ).toFixed(2),

        totalTime:
            totalTime,

        answers: userAnswers

    };

    // SAVE REPORT

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

    // BLOCK BACK BUTTON

    history.pushState(
        null,
        null,
        location.href
    );

    window.onpopstate = function () {

        history.go(1);

    };

    // REDIRECT TO REPORT

    window.location.href =
        "report.html";

}