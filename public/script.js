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

        if(document.getElementById(field).value === ""){

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

// START ACTUAL TEST
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

    questionStartTime = new Date();

    selectedAnswer = "";

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
    ).innerHTML =
        optionsHTML;

    startQuestionTimer();
}

// TIMER
function startQuestionTimer(){

    timer = setInterval(() => {

        document.getElementById(
            "timer"
        ).innerHTML =
            "Time Left : "
            + questionTime
            + " sec";

        questionTime--;

        if(questionTime < 0){

            clearInterval(timer);

            nextQuestion();
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
            selectedAnswer,

        correctAnswer:
            questions[currentQuestion].answer,

        isCorrect:

            selectedAnswer ===
            questions[currentQuestion].answer,

        timeTakenInSeconds:
            timeTaken

    });

    if(

        selectedAnswer ===
        questions[currentQuestion].answer

    ){

        score++;

    }

    currentQuestion++;

    selectedAnswer = "";

    if(currentQuestion < questions.length){

        loadQuestion();

    }

    else{

        finishTest();

    }

}
// FINISH TEST
async function finishTest(){

    clearInterval(timer);

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

    const resultData = {

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

};

    console.log(resultData);

    try{

        const response =
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

        const data =
            await response.json();

        console.log(data);

        alert("Result Saved Successfully");

    }catch(error){

        console.log(error);

        alert("Saving Failed");

    }
   function exitTest() {

    alert("Exit button clicked");

    document.body.innerHTML = `

        <div style="
            height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
            background:#0f172a;
            color:white;
            font-family:Arial;
        ">

            <h1>Thank You!</h1>

            <p>You may now close this tab.</p>

        </div>

    `;

}
}
