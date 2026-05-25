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

let visitedQuestions =
    new Array(questions.length).fill(false);

let globalTime = 600;

let globalTimer;

// VALIDATION
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

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(name === ""){

        alert("Enter Name");

        return;

    }

    if(age < 15 || age > 80){

        alert("Enter Valid Age");

        return;

    }

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

// BEGIN TEST
function beginActualTest(){

    if(localStorage.getItem("testCompleted")){

        alert(
            "Test Already Completed"
        );

        return;

    }

    document.getElementById(
        "instructionPage"
    ).style.display = "none";

    document.getElementById(
        "testSection"
    ).style.display = "block";

    document.getElementById(
        "displayName"
    ).innerHTML =
        document.getElementById("name").value;

    document.getElementById(
        "displayEmail"
    ).innerHTML =
        document.getElementById("email").value;

    startGlobalTimer();

    loadQuestion();

}

// GLOBAL TIMER
function startGlobalTimer(){

    updateGlobalTimer();

    globalTimer = setInterval(() => {

        globalTime--;

        updateGlobalTimer();

        if(globalTime <= 0){

            clearInterval(globalTimer);

            finishTest();

        }

    },1000);

}

function updateGlobalTimer(){

    const minutes =
        Math.floor(globalTime / 60);

    const seconds =
        globalTime % 60;

    document.getElementById(
        "globalTimer"
    ).innerHTML =

        `${minutes}:${seconds
            .toString()
            .padStart(2,'0')}`;

}

// LOAD QUESTION
function loadQuestion(){

    visitedQuestions[currentQuestion] = true;

    updateQuestionStatus();

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

            ${option}

        </label>

        `;

    });

    document.getElementById(
        "optionsContainer"
    ).innerHTML =
        optionsHTML;

    // BUTTON TEXT

    if(currentQuestion ===
        questions.length - 1){

        document.getElementById(
            "nextBtn"
        ).innerHTML =
            "Finish Test";

    }

    else{

        document.getElementById(
            "nextBtn"
        ).innerHTML =
            "Next Question";

    }

}

// QUESTION STATUS
function updateQuestionStatus(){

    const container =
        document.getElementById(
            "questionStatusContainer"
        );

    container.innerHTML = "";

    for(let i=0;i<questions.length;i++){

        let className =
            "not-visited";

        if(i === currentQuestion){

            className = "current";

        }

        else if(

            userAnswers[i]
            &&
            userAnswers[i]
            .selectedOption !==
            "Not Answered"

        ){

            className = "answered";

        }

        else if(visitedQuestions[i]){

            className =
                "not-answered";

        }

        container.innerHTML += `

        <div class="
            status-circle
            ${className}
        ">
            ${i+1}
        </div>

        `;

    }

}

// SELECT ANSWER
function selectAnswer(answer){

    userAnswers[currentQuestion] = {

        question:
            questions[currentQuestion]
            .question,

        selectedOption:
            answer,

        correctAnswer:
            questions[currentQuestion]
            .answer,

        isCorrect:

            answer ===
            questions[currentQuestion]
            .answer

    };

    updateQuestionStatus();

}

// NEXT QUESTION
function nextQuestion(){

    if(

        currentQuestion <
        questions.length - 1

    ){

        currentQuestion++;

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
async function finishTest(){

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

        totalScore:
            score,

        correctAnswers:
            score,

        wrongAnswers:
            questions.length - score,

        accuracy:
            (
                score /
                questions.length
            ) * 100,

        totalTime:
            600 - globalTime,

        answers:
            userAnswers

    };

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

                body:JSON.stringify(reportData)

            }

        );

    }catch(error){

        console.log(error);

    }

    window.location.href =
        "report.html";

}