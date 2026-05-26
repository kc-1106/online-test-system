const questions = [
    { question: "Question 1", image: "images/q1.png", options: ["A","B","C","D","E"], answer: "C" },
    { question: "Question 2", image: "images/q2.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 3", image: "images/q3.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 4", image: "images/q4.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 5", image: "images/q5.png", options: ["A","B","C","D","E"], answer: "D" },
    { question: "Question 6", image: "images/q6.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 7", image: "images/q7.png", options: ["A","B","C","D","E"], answer: "E" },
    { question: "Question 8", image: "images/q8.png", options: ["A","B","C","D","E"], answer: "B" },
    { question: "Question 9", image: "images/q9.png", options: ["A","B","C","D","E"], answer: "D" },
    { question: "Question 10", image: "images/q10.png", options: ["A","B","C","D","E"], answer: "C" }
];

// ================= VARIABLES =================
let currentQuestion = 0;
let userAnswers = Array(questions.length).fill(null);
let questionStatus = Array(questions.length).fill("not-visited");

let questionTimers = Array(questions.length).fill(60);

let localTimer;
let localTime = 60;
let globalTime = 600;
let globalTimer;

// ================= START TEST =================
function startTest(){

    const fields = ["name","age","profession","experience","email","college","department"];

    for(let f of fields){
        const val = document.getElementById(f).value.trim();
        if(val === ""){
            alert("Please fill all fields");
            return;
        }
    }

    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){
        alert("Enter valid email");
        return;
    }

    document.getElementById("registrationForm").style.display = "none";
    document.getElementById("instructionPage").style.display = "block";
}

// ================= BEGIN TEST =================
function beginActualTest(){

    document.getElementById("instructionPage").style.display = "none";
    document.getElementById("testSection").style.display = "block";

    document.getElementById("displayUserName").innerText =
        document.getElementById("name").value;

    document.getElementById("displayUserEmail").innerText =
        document.getElementById("email").value;

    startGlobalTimer();
    loadQuestion();
}

// ================= GLOBAL TIMER =================
function startGlobalTimer(){

    globalTimer = setInterval(() => {

        globalTime--;

        let m = Math.floor(globalTime / 60);
        let s = globalTime % 60;

        document.getElementById("globalTimer").innerText =
            `${m}:${s < 10 ? "0"+s : s}`;

        if(globalTime <= 0){
            clearInterval(globalTimer);
            finishTest();
        }

    },1000);
}

// ================= LOCAL TIMER =================
function startLocalTimer(){

    clearInterval(localTimer);

    localTime = questionTimers[currentQuestion];

    document.getElementById("timer").innerText = localTime;

    localTimer = setInterval(() => {

        localTime--;
        questionTimers[currentQuestion] = localTime;

        document.getElementById("timer").innerText = localTime;

        if(localTime <= 0){
            clearInterval(localTimer);
            if(!userAnswers[currentQuestion]){
                saveSkippedAnswer("timeout");
            }
            nextQuestion();
        }

    },1000);
}

// ================= LOAD QUESTION =================
function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("questionTitle").innerText = q.question;
    document.getElementById("questionImage").src = q.image;

    if(questionStatus[currentQuestion] === "not-visited"){
        questionStatus[currentQuestion] = "current";
    }

    let html = "";

    q.options.forEach(opt => {

        const checked =
            userAnswers[currentQuestion]?.selectedOption === opt
            ? "checked" : "";

        html += `
            <label class="option">
                <input type="radio"
                    name="option"
                    value="${opt}"
                    ${checked}
                    onchange="selectAnswer('${opt}')">
                <div style="margin-top:10px">${opt}</div>
            </label>
        `;
    });

    document.getElementById("optionsContainer").innerHTML = html;

    updateQuestionStatus();
    startLocalTimer();

    document.getElementById("prevBtn").disabled = currentQuestion === 0;

    document.getElementById("nextBtn").innerText =
        currentQuestion === questions.length - 1
        ? "Finish Test"
        : "Next Question";
}

// ================= SELECT ANSWER =================
function selectAnswer(ans){

    const timeTaken = 60 - questionTimers[currentQuestion];

    userAnswers[currentQuestion] = {
        question: questions[currentQuestion].question,
        image: questions[currentQuestion].image,
        selectedOption: ans,
        correctAnswer: questions[currentQuestion].answer,
        isCorrect: ans === questions[currentQuestion].answer,
        timeTakenInSeconds: timeTaken,
        skipReason: "none"
    };

    questionStatus[currentQuestion] = "answered";
    updateQuestionStatus();
}

// ================= SKIP =================
function saveSkippedAnswer(reason){

    userAnswers[currentQuestion] = {
        question: questions[currentQuestion].question,
        image: questions[currentQuestion].image,
        selectedOption: "Not Answered",
        correctAnswer: questions[currentQuestion].answer,
        isCorrect: false,
        timeTakenInSeconds: 60 - questionTimers[currentQuestion],
        skipReason: reason
    };

    questionStatus[currentQuestion] = "not-answered";
}

// ================= STATUS UI (FIXED) =================
function updateQuestionStatus(){

    let html = "";

    for(let i=0;i<questions.length;i++){

        let cls = "not-visited";

        if(i === currentQuestion) cls = "current";
        else if(userAnswers[i]?.selectedOption && userAnswers[i].selectedOption !== "Not Answered") cls = "answered";
        else if(questionStatus[i] === "not-answered") cls = "not-answered";

        html += `
            <div class="status-circle ${cls}" onclick="goToQuestion(${i})">
                ${i+1}
            </div>
        `;
    }

    document.getElementById("questionStatusContainer").innerHTML = html;
}

// ================= NAVIGATION =================
function goToQuestion(i){
    clearInterval(localTimer);
    currentQuestion = i;
    loadQuestion();
}

function nextQuestion(){
    clearInterval(localTimer);

    if(!userAnswers[currentQuestion]){
        saveSkippedAnswer(localTime <= 0 ? "timeout" : "manual-skip");
    }

    if(currentQuestion === questions.length - 1){
        finishTest();
        return;
    }

    currentQuestion++;
    loadQuestion();
}

function previousQuestion(){
    clearInterval(localTimer);

    if(!userAnswers[currentQuestion]){
        questionStatus[currentQuestion] = "not-answered";
    }

    if(currentQuestion > 0){
        currentQuestion--;
        loadQuestion();
    }
}

// ================= FINISH TEST =================
function finishTest(){

    clearInterval(globalTimer);
    clearInterval(localTimer);

    let score = 0;

    userAnswers.forEach(a => {
        if(a?.isCorrect) score++;
    });

    const reportData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        score,
        totalQuestions: questions.length,
        answers: userAnswers,
        submittedAt: new Date()
    };

    fetch("https://online-test-system-pqd0.onrender.com/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData)
    })
    .then(r => r.json())
    .then(d => console.log("Saved:", d))
    .catch(e => console.log("Error:", e));

    document.getElementById("testSection").style.display = "none";
    document.getElementById("result").style.display = "block";

    document.getElementById("scoreText").innerText =
        `${score} / ${questions.length}`;

    setTimeout(() => {
        window.location.href = "report.html";
    }, 3000);
}