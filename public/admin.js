const API_URL =
"https://online-test-system-pqd0.onrender.com/results";

let allResults = [];

/* ========================= */
/* LOAD DASHBOARD */
/* ========================= */

async function loadDashboard(){

    try{

        const response = await fetch(API_URL);

        const data = await response.json();

        allResults = data;

        generateKPIs(data);

        generateTable(data);

        generateChart(data);

        generateAIInsights(data);

    }

    catch(error){

        console.log(error);

        alert("Failed To Load Dashboard");

    }

}

/* ========================= */
/* KPI CALCULATION */
/* ========================= */

function generateKPIs(data){

    const totalStudents = data.length;

    let totalScore = 0;

    let totalAccuracy = 0;

    let highPerformers = 0;

    data.forEach(student => {

        totalScore += student.score || 0;

        totalAccuracy +=
            parseFloat(student.accuracy) || 0;

        if(student.score >= 8){

            highPerformers++;

        }

    });

    const avgScore =
        totalStudents > 0
        ? (totalScore / totalStudents).toFixed(2)
        : 0;

    const avgAccuracy =
        totalStudents > 0
        ? (totalAccuracy / totalStudents).toFixed(2)
        : 0;

    document.getElementById("totalStudents").innerText =
        totalStudents;

    document.getElementById("averageScore").innerText =
        avgScore;

    document.getElementById("averageAccuracy").innerText =
        avgAccuracy + "%";

    document.getElementById("highPerformers").innerText =
        highPerformers;

}

/* ========================= */
/* TABLE */
/* ========================= */

function generateTable(data){

    let html = "";

    data.reverse().forEach(student => {

        html += `

            <tr>

                <td>${student.name || "-"}</td>

                <td>${student.email || "-"}</td>

                <td>${student.score || 0}</td>

                <td>${student.accuracy || "0%"}</td>

                <td>${student.behaviorAnalysis || "-"}</td>

                <td>${student.submittedAt || "-"}</td>

            </tr>

        `;

    });

    document.getElementById("studentTableBody")
        .innerHTML = html;

}

/* ========================= */
/* CHART */
/* ========================= */

function generateChart(data){

    const labels = data.map(s => s.name);

    const scores = data.map(s => s.score);

    const ctx =
        document.getElementById("scoreChart");

    new Chart(ctx, {

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Student Scores",

                data:scores,

                borderWidth:1

            }]

        },

        options:{

            responsive:true,

            scales:{
                y:{
                    beginAtZero:true,
                    max:10
                }
            }

        }

    });

}

/* ========================= */
/* AI INSIGHTS */
/* ========================= */

function generateAIInsights(data){

    let fastThinkers = 0;

    let slowThinkers = 0;

    let highAccuracy = 0;

    data.forEach(student => {

        if(student.fastAnsweredQuestions >= 5){

            fastThinkers++;

        }

        if(student.slowAnsweredQuestions >= 5){

            slowThinkers++;

        }

        const acc =
            parseFloat(student.accuracy) || 0;

        if(acc >= 80){

            highAccuracy++;

        }

    });

    let html = `

        <div class="ai-box">

            🚀 Fast Responders :
            <b>${fastThinkers}</b>

        </div>

        <div class="ai-box">

            🧠 Deep Thinkers :
            <b>${slowThinkers}</b>

        </div>

        <div class="ai-box">

            🎯 High Accuracy Students :
            <b>${highAccuracy}</b>

        </div>

    `;

    document.getElementById("aiInsights")
        .innerHTML = html;

}

/* ========================= */
/* EXPORT CSV */
/* ========================= */

function exportCSV(){

    let csv =
        "Name,Email,Score,Accuracy\n";

    allResults.forEach(student => {

        csv +=
        `${student.name},${student.email},${student.score},${student.accuracy}\n`;

    });

    const blob = new Blob([csv], {
        type:"text/csv"
    });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "student_results.csv";

    a.click();

}

/* ========================= */
/* INITIAL LOAD */
/* ========================= */

loadDashboard();