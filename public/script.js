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

        let totalTime = 0;

userAnswers.forEach(answer => {

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
        Math.floor(totalTime),

    answers: userAnswers

};

localStorage.setItem(
    "testReport",
    JSON.stringify(reportData)
);

        window.location.href = "report.html";
        
    }catch(error){

        console.log(error);

        alert("Saving Failed");

    }
    function generateReport(){

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    let totalCorrect = score;

    let totalWrong =
        questions.length - score;

    let accuracy =
        (
            (score / questions.length) * 100
        ).toFixed(2);

    let totalTime = 0;

    userAnswers.forEach(answer => {

        totalTime +=
            answer.timeTakenInSeconds;

    });

    let reportHTML = `

        <div style="
            margin-top:30px;
            text-align:left;
            line-height:2;
            font-size:18px;
        ">

            <p>
                <strong>Name :</strong>
                ${name}
            </p>

            <p>
                <strong>Email :</strong>
                ${email}
            </p>

            <p>
                <strong>Total Score :</strong>
                ${score} / ${questions.length}
            </p>

            <p>
                <strong>Correct Answers :</strong>
                ${totalCorrect}
            </p>

            <p>
                <strong>Wrong Answers :</strong>
                ${totalWrong}
            </p>

            <p>
                <strong>Accuracy :</strong>
                ${accuracy}%
            </p>

            <p>
                <strong>Total Time Taken :</strong>
                ${Math.floor(totalTime)} seconds
            </p>

        </div>

        <h2 style="
            margin-top:40px;
            margin-bottom:20px;
        ">
            Question-wise Analysis
        </h2>

        <table class="report-table">

            <tr>

                <th>Question</th>

                <th>Your Answer</th>

                <th>Correct Answer</th>

                <th>Status</th>

                <th>Time Taken</th>

            </tr>

    `;

    userAnswers.forEach(answer => {

        reportHTML += `

            <tr>

                <td>
                    ${answer.question}
                </td>

                <td>
                    ${
                        answer.selectedOption
                        || "Not Answered"
                    }
                </td>

                <td>
                    ${answer.correctAnswer}
                </td>

                <td>

                    ${
                        answer.isCorrect
                        ? "✅ Correct"
                        : "❌ Wrong"
                    }

                </td>

                <td>
                    ${Math.floor(
                        answer.timeTakenInSeconds
                    )} sec
                </td>

            </tr>

        `;
    });

    reportHTML += `</table>`;

    document.getElementById(
        "reportContent"
    ).innerHTML = reportHTML;

    document.getElementById(
        "reportSection"
    ).style.display = "block";

}
}
