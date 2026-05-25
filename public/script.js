const questions = [

    {
        question: "Question 1",
        image: "images/q1.png",
        options: ["A","B","C","D","E"],
        answer: "E"
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

let userAnswers = new Array(questions.length).fill("");

let visitedQuestions = new Array(questions.length).fill(false);

let score = 0;

let totalTime = 600;

let globalTimer;

let startTime;

let testSubmitted = false;

// START TEST

function startTest(){

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const age =
        document.getElementById("age").value.trim();

    const profession =
        document.getElementById("profession").value.trim();

    const experience =
        document.getElementById("experience").value.trim();

    const college =
        document.getElementById("college").value.trim();

    const department =
        document.getElementById("department").value.trim();

    if(
        !name ||
        !email ||
        !age ||
        !profession ||
        !experience ||
        !college ||
        !department
    ){

        alert("Please fill all fields");

        return;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Enter valid email");

        return;
    }

    if(age < 15 || age > 100){

        alert("Enter valid age");

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

    if(localStorage.getItem("testSubmitted")){

        alert(
            "You have already completed the test"
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

    startTime = new Date();

    startGlobalTimer();

    loadQuestion();
}

// GLOBAL TIMER

function startGlobalTimer(){

    globalTimer = setInterval(()=>{

        let minutes =
            Math.floor(totalTime / 60);

        let seconds =
            totalTime % 60;

        if(seconds < 10){

            seconds = "0" + seconds;
        }

        document.getElementById(
            "globalTimer"
        ).innerHTML =
            minutes + ":" + seconds;

        totalTime--;

        if(totalTime < 0){

            clearInterval(globalTimer);

            finishTest();
        }

    },1000);
}

// LOAD QUESTION

function loadQuestion(){

    updateQuestionStatus();

    visitedQuestions[currentQuestion] = true;

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
            userAnswers[currentQuestion] === option
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

    const nextBtn =
        document.getElementById("nextBtn");

    if(currentQuestion === questions.length - 1){

        nextBtn.innerHTML = "Finish Test";

    }else{

        nextBtn.innerHTML = "Next Question";
    }
}

// UPDATE STATUS

function updateQuestionStatus(){

    const container =
        document.getElementById(
            "questionStatusContainer"
        );

    container.innerHTML = "";

    for(let i = 0; i < questions.length; i++){

        let statusClass = "";

        if(i === currentQuestion){

            statusClass = "current";
        }

        else if(userAnswers[i] !== ""){

            statusClass = "answered";
        }

        else if(visitedQuestions[i]){

            statusClass = "not-answered";
        }

        else{

            statusClass = "not-visited";
        }

        container.innerHTML += `

            <div
                class="status-circle ${statusClass}"
                onclick="goToQuestion(${i})"
            >

                ${i + 1}

            </div>

        `;
    }
}

// SELECT ANSWER

function selectAnswer(answer){

    userAnswers[currentQuestion] = answer;

    updateQuestionStatus();
}

// NEXT QUESTION

function nextQuestion(){

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

function goToQuestion(index){

    currentQuestion = index;

    loadQuestion();
}

// FINISH TEST

async function finishTest(){

    if(testSubmitted){

        return;
    }

    testSubmitted = true;

    clearInterval(globalTimer);

    score = 0;

    let wrongAnswers = 0;

    let totalSecondsTaken =
        600 - totalTime;

    let answersReport = [];

    for(let i = 0; i < questions.length; i++){

        const isCorrect =
            userAnswers[i] ===
            questions[i].answer;

        if(isCorrect){

            score++;

        }else{

            wrongAnswers++;
        }

        answersReport.push({

            question:
                questions[i].question,

            selectedOption:
                userAnswers[i],

            correctAnswer:
                questions[i].answer,

            status:
                isCorrect
                ? "Correct"
                : "Wrong"
        });
    }

    const accuracy =
        (
            (score / questions.length) * 100
        ).toFixed(2);

    const resultData = {

        name:
            document.getElementById("name").value,

        email:
            document.getElementById("email").value,

        score: score,

        totalQuestions:
            questions.length,

        correctAnswers: score,

        wrongAnswers: wrongAnswers,

        accuracy: accuracy,

        totalTimeTaken:
            totalSecondsTaken,

        answers: answersReport
    };

    localStorage.setItem(
        "reportData",
        JSON.stringify(resultData)
    );

    localStorage.setItem(
        "testSubmitted",
        "true"
    );

    document.getElementById(
        "testSection"
    ).style.display = "none";

    document.getElementById(
        "result"
    ).style.display = "block";

    try{

        await fetch(

            "https://online-test-system-pqd0.onrender.com/save-result",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify(resultData)
            }
        );

    }catch(error){

        console.log(error);
    }

    setTimeout(()=>{

        window.location.href =
            "report.html";

    },3000);
}