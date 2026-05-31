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

function generateCharts(data){

    let c1 = 0;
    let c2 = 0;
    let c3 = 0;

    let maleC1 = 0;
    let maleC2 = 0;
    let maleC3 = 0;

    let femaleC1 = 0;
    let femaleC2 = 0;
    let femaleC3 = 0;

    let maleCount = 0;
    let femaleCount = 0;

    data.forEach(student=>{

        if(!student.answers) return;

        let cluster1Correct = 0;
        let cluster2Correct = 0;
        let cluster3Correct = 0;

        student.answers.forEach((ans,index)=>{

            const q=index+1;

            if(ans.isCorrect){

                if([1,2,6,10].includes(q))
                    cluster1Correct++;

                if([3,4,5].includes(q))
                    cluster2Correct++;

                if([7,8,9].includes(q))
                    cluster3Correct++;
            }
        });

        c1 += cluster1Correct;
        c2 += cluster2Correct;
        c3 += cluster3Correct;

        if(student.gender==="Male"){

            maleCount++;

            maleC1 += cluster1Correct;
            maleC2 += cluster2Correct;
            maleC3 += cluster3Correct;
        }

        if(student.gender==="Female"){

            femaleCount++;

            femaleC1 += cluster1Correct;
            femaleC2 += cluster2Correct;
            femaleC3 += cluster3Correct;
        }

    });

    const totalStudents=data.length;

    const overall=
    (
        (c1+c2+c3)/
        (totalStudents*10)
    )*100;

    const overallChart = new ApexCharts(
        document.querySelector("#overallChart"),
        {
            chart:{
                type:"bar",
                height:350
            },

            series:[{
                name:"Accuracy %",
                data:[
                    (c1/(totalStudents*4)*100).toFixed(2),
                    (c2/(totalStudents*3)*100).toFixed(2),
                    (c3/(totalStudents*3)*100).toFixed(2),
                    overall.toFixed(2)
                ]
            }],

            xaxis:{
                categories:[
                    "Cluster 1",
                    "Cluster 2",
                    "Cluster 3",
                    "Overall"
                ]
            },

            title:{
                text:"Overall Performance"
            }
        }
    );

    overallChart.render();

    const maleOverall=
    (
        (maleC1+maleC2+maleC3)/
        (maleCount*10 || 1)
    )*100;

    new ApexCharts(
        document.querySelector("#maleChart"),
        {
            chart:{
                type:"bar",
                height:350
            },

            series:[{
                data:[
                    (maleC1/(maleCount*4 || 1)*100).toFixed(2),
                    (maleC2/(maleCount*3 || 1)*100).toFixed(2),
                    (maleC3/(maleCount*3 || 1)*100).toFixed(2),
                    maleOverall.toFixed(2)
                ]
            }],

            xaxis:{
                categories:[
                    "Cluster 1",
                    "Cluster 2",
                    "Cluster 3",
                    "Overall"
                ]
            },

            title:{
                text:"Male Performance"
            }
        }
    ).render();

    const femaleOverall=
    (
        (femaleC1+femaleC2+femaleC3)/
        (femaleCount*10 || 1)
    )*100;

    new ApexCharts(
        document.querySelector("#femaleChart"),
        {
            chart:{
                type:"bar",
                height:350
            },

            series:[{
                data:[
                    (femaleC1/(femaleCount*4 || 1)*100).toFixed(2),
                    (femaleC2/(femaleCount*3 || 1)*100).toFixed(2),
                    (femaleC3/(femaleCount*3 || 1)*100).toFixed(2),
                    femaleOverall.toFixed(2)
                ]
            }],

            xaxis:{
                categories:[
                    "Cluster 1",
                    "Cluster 2",
                    "Cluster 3",
                    "Overall"
                ]
            },

            title:{
                text:"Female Performance"
            }
        }
    ).render();

}

function generateMaleFemaleClusterChart(data){

    const males =
        data.filter(
            s => s.gender &&
            s.gender.toLowerCase() === "male"
        );

    const females =
        data.filter(
            s => s.gender &&
            s.gender.toLowerCase() === "female"
        );

    function clusterAverage(students, questions){

        let totalCorrect = 0;

        let totalPossible =
            students.length * questions.length;

        students.forEach(student => {

            if(!student.answers) return;

            student.answers.forEach((ans,index)=>{

                const qNo = index + 1;

                if(
                    questions.includes(qNo) &&
                    ans.isCorrect
                ){
                    totalCorrect++;
                }

            });

        });

        if(totalPossible === 0) return 0;

        return Number(
            (
                totalCorrect /
                totalPossible *
                100
            ).toFixed(2)
        );

    }

    const cluster1 = [1,2,6,10];
    const cluster2 = [3,4,5];
    const cluster3 = [7,8,9];

    const maleData = [

        clusterAverage(
            males,
            cluster1
        ),

        clusterAverage(
            males,
            cluster2
        ),

        clusterAverage(
            males,
            cluster3
        )

    ];

    const femaleData = [

        clusterAverage(
            females,
            cluster1
        ),

        clusterAverage(
            females,
            cluster2
        ),

        clusterAverage(
            females,
            cluster3
        )

    ];

    const options = {

        chart:{
            type:'line',
            height:400
        },

        series:[
            {
                name:'Male',
                data:maleData
            },
            {
                name:'Female',
                data:femaleData
            }
        ],

        xaxis:{
            categories:[
                'Cluster 1',
                'Cluster 2',
                'Cluster 3'
            ]
        },

        stroke:{
            curve:'smooth',
            width:4
        },

        markers:{
            size:6
        },

        dataLabels:{
            enabled:true
        },

        title:{
            text:'Cluster-wise Male vs Female Comparison'
        },

        yaxis:{
            title:{
                text:'Accuracy %'
            },
            max:100
        }

    };

    new ApexCharts(
        document.querySelector(
            "#maleFemaleClusterChart"
        ),
        options
    ).render();

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

generateMaleFemaleClusterChart(data);