// =====================================================
// NWC SMART NETWORK MONITORING
// Interactive Dashboard
// =====================================================


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId, button) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active-page");

        });


    document
        .getElementById(pageId)
        .classList.add("active-page");


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    button.classList.add("active");
}



/* =====================================================
   NETWORK CHART
===================================================== */

const chartCanvas =
    document.getElementById("networkChart");


const labels = [
    "10:00",
    "10:05",
    "10:10",
    "10:15",
    "10:20",
    "10:25",
    "10:30",
    "10:35",
    "10:40",
    "10:45",
    "10:50",
    "10:55"
];


const cpuData = [
    32,
    35,
    37,
    41,
    39,
    44,
    48,
    43,
    45,
    41,
    38,
    40
];


const memoryData = [
    42,
    44,
    43,
    47,
    48,
    49,
    51,
    50,
    52,
    49,
    48,
    50
];


const networkChart =
    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "CPU Usage %",
                    data: cpuData,

                    tension: 0.4,

                    borderWidth: 2,

                    pointRadius: 2
                },

                {
                    label: "Memory Usage %",
                    data: memoryData,

                    tension: 0.4,

                    borderWidth: 2,

                    pointRadius: 2
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            },

            scales: {

                y: {
                    beginAtZero: true,

                    max: 100
                }

            }

        }

    });



/* =====================================================
   FAILURE SIMULATOR
===================================================== */

function analyzeFailure() {

    const device =
        document.getElementById(
            "deviceSelect"
        ).value;


    const failure =
        document.getElementById(
            "failureSelect"
        ).value;


    let risk = 0;

    let issue = "Normal";

    let diagnosis =
        "No significant network anomaly detected.";

    let recommendation =
        "No immediate action required. Continue monitoring.";

    let status =
        "● NORMAL";


    /* -------------------------------
       NORMAL
    -------------------------------- */

    if (failure === "normal") {

        risk = 0;

        issue = "Normal";

        diagnosis =
            device +
            " is operating within normal performance thresholds.";

        recommendation =
            "Continue normal monitoring.";

    }


    /* -------------------------------
       HIGH CPU
    -------------------------------- */

    else if (failure === "cpu") {

        risk = 87;

        issue = "High CPU";

        diagnosis =
            "The AI detected abnormal CPU utilization on " +
            device +
            ". The device may be experiencing excessive " +
            "processing load or abnormal traffic.";

        recommendation =
            "Inspect CPU-intensive processes, traffic load, " +
            "and current network utilization.";

    }


    /* -------------------------------
       HIGH MEMORY
    -------------------------------- */

    else if (failure === "memory") {

        risk = 78;

        issue = "High Memory";

        diagnosis =
            "Memory utilization has exceeded the normal " +
            "operating threshold.";

        recommendation =
            "Inspect memory-consuming processes and applications.";

    }


    /* -------------------------------
       HIGH LATENCY
    -------------------------------- */

    else if (failure === "latency") {

        risk = 72;

        issue = "High Latency";

        diagnosis =
            "The AI detected abnormal network latency. " +
            "This may indicate congestion, routing problems, " +
            "or an overloaded interface.";

        recommendation =
            "Check routing paths, congestion, and interface utilization.";

    }


    /* -------------------------------
       PACKET LOSS
    -------------------------------- */

    else if (failure === "loss") {

        risk = 82;

        issue = "Packet Loss";

        diagnosis =
            "Abnormal packet loss was detected. " +
            "This may indicate link degradation, congestion, " +
            "or interface problems.";

        recommendation =
            "Inspect interface errors, link quality, and congestion.";

    }


    /* -------------------------------
       INTERFACE ERRORS
    -------------------------------- */

    else if (failure === "errors") {

        risk = 91;

        issue = "Interface Errors";

        diagnosis =
            "A high number of interface errors was detected. " +
            "This could indicate a physical link or interface issue.";

        recommendation =
            "Inspect the physical interface, cable, duplex settings, " +
            "and link configuration.";

    }


    /* =================================================
       UPDATE UI
    ================================================= */

    document.getElementById(
        "diagnosisTitle"
    ).innerText = issue;


    document.getElementById(
        "riskScore"
    ).innerText = risk;


    document.getElementById(
        "diagnosisText"
    ).innerText = diagnosis;


    document.getElementById(
        "recommendationText"
    ).innerText = recommendation;


    const statusBox =
        document.getElementById(
            "diagnosisStatus"
        );


    statusBox.className =
        "diagnosis-status";


    /* =================================================
       STATUS LEVEL
    ================================================= */

    if (risk >= 75) {

        statusBox.classList.add(
            "critical-status"
        );

        statusBox.innerText =
            "● CRITICAL";

    }

    else if (risk >= 45) {

        statusBox.classList.add(
            "warning-status"
        );

        statusBox.innerText =
            "● HIGH RISK";

    }

    else {

        statusBox.classList.add(
            "normal-status"
        );

        statusBox.innerText =
            "● NORMAL";
    }


    /* =================================================
       UPDATE TOPOLOGY
    ================================================= */

    const deviceElement =
        document.getElementById(device);


    if (deviceElement) {

        deviceElement.classList.remove(
            "normal",
            "critical"
        );


        if (risk >= 75) {

            deviceElement.classList.add(
                "critical"
            );

        }

        else {

            deviceElement.classList.add(
                "normal"
            );

        }

    }


    /* =================================================
       UPDATE HAIL CARD
    ================================================= */

    if (device === "R4-HAIL") {

        document.getElementById(
            "hailCPU"
        ).innerText =
            failure === "cpu"
                ? "96%"
                : "40%";


        document.getElementById(
            "hailRisk"
        ).innerText =
            risk + "/100";


        document.getElementById(
            "hailBar"
        ).style.width =
            failure === "cpu"
                ? "96%"
                : "40%";

    }


    /* =================================================
       ADD ALERT
    ================================================= */

    if (risk >= 45) {

        addAlert(
            device,
            issue,
            risk
        );

    }

}



/* =====================================================
   ADD ALERT TO DASHBOARD
===================================================== */

function addAlert(
    device,
    issue,
    risk
) {

    const alertsList =
        document.getElementById(
            "alertsList"
        );


    const alert =
        document.createElement(
            "div"
        );


    alert.className =
        "alert critical";


    alert.innerHTML = `

        <div class="alert-icon">
            !
        </div>

        <div class="alert-content">

            <strong>
                ${device}
            </strong>

            <p>
                ${issue}
            </p>

            <small>
                Risk Score: ${risk}/100
            </small>

        </div>

        <span class="alert-time">
            NOW
        </span>

    `;


    alertsList.prepend(
        alert
    );


    /* Update alert counter */

    const counter =
        document.getElementById(
            "alertCount"
        );


    let count =
        parseInt(
            counter.innerText
        );


    counter.innerText =
        count + 1;

}



/* =====================================================
   DEVICE CHART SWITCHER
===================================================== */

document
    .getElementById("chartDevice")
    .addEventListener(
        "change",
        function () {

            const selected =
                this.value;


            const randomOffset =
                Math.floor(
                    Math.random() * 15
                );


            networkChart.data.datasets[0].data =
                cpuData.map(
                    value =>
                        Math.min(
                            value + randomOffset,
                            100
                        )
                );
           function enterDashboard() {
    document.getElementById("welcome-screen").style.display = "none";
}


            networkChart.update();

        }
    );
