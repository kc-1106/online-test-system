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

let score = 0;

let selectedAnswer = "";

let userAnswers = [];

let questionTime = 60;

let timer;

let questionStartTime;

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

    selectedAnswer = "";

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

        optionsHTML += `

        <label class="option">

            <input
                type="radio"
                name="option"
                value="${option}"
                onchange="selectAnswer('${option}')"
            >

            ${option}

        </label>

        `;

    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML = optionsHTML;

    // CHANGE BUTTON TEXT

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

            return;

        }

    },1000);

}

// SELECT ANSWER
function selectAnswer(answer){

    selectedAnswer = answer;

}

// NEXT QUESTION
function nextQuestion(){

    clearInterval(timer);

    const questionEndTime =
        new Date();

    const timeTaken =
        (questionEndTime - questionStartTime) / 1000;

    userAnswers.push({

        question:
            questions[currentQuestion].question,

        image:
            questions[currentQuestion].image,

        selectedOption:
            selectedAnswer || "Not Answered",

        correctAnswer:
            questions[currentQuestion].answer,

        isCorrect:

            selectedAnswer ===
            questions[currentQuestion].answer,

        timeTakenInSeconds:
            Math.floor(timeTaken)

    });

    if(

        selectedAnswer ===
        questions[currentQuestion].answer

    ){

        score++;

    }

    currentQuestion++;

    selectedAnswer = "";

    // LOAD NEXT QUESTION

    if(currentQuestion < questions.length){

        loadQuestion();

    }

    // FINISH TEST

    else{

        document.getElementById(
            "timer"
        ).innerHTML =
            "Generating Report...";

        finishTest();

    }

}

// FINISH TEST
function finishTest(){

    clearInterval(timer);

    let totalTime = 0;

    userAnswers.forEach(answer => {

        totalTime +=
            answer.timeTakenInSeconds;

    });

    // SAVE REPORT DATA

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

    // STORE IN LOCAL STORAGE

    localStorage.setItem(

        "testReport",

        JSON.stringify(reportData)

    );

    // SAVE TO DATABASE FAST

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

    // REDIRECT FAST

    setTimeout(() => {

        window.location.href =
            "report.html";

    },1000);

}