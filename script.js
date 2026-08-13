// =====================================================
// NWC SMART NETWORK MONITORING
// Interactive Dashboard
// =====================================================


/* =====================================================
   PAGE NAVIGATION
===================================================== */
const AI_API_URL ="https://nwc-smart-network-monitoring.onrender.com";
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
async function analyzeFailure() {

    const device =
        document.getElementById("deviceSelect").value;

    const failure =
        document.getElementById("failureSelect").value;


    // ==========================================
    // NETWORK DATA FOR AI
    // ==========================================

    let networkData = {
        cpu_usage: 35,
        memory_usage: 45,
        bandwidth_mbps: 100,
        latency_ms: 20,
        packet_loss_percent: 0.5,
        interface_errors: 1
    };


    // ==========================================
    // FAILURE SIMULATION
    // ==========================================

    if (failure === "cpu") {

        networkData.cpu_usage = 97;
        networkData.memory_usage = 53;
        networkData.bandwidth_mbps = 104;
        networkData.latency_ms = 21;
        networkData.packet_loss_percent = 0.2;
        networkData.interface_errors = 1;

    }

    else if (failure === "memory") {

        networkData.cpu_usage = 42;
        networkData.memory_usage = 92;
        networkData.bandwidth_mbps = 98;
        networkData.latency_ms = 22;
        networkData.packet_loss_percent = 0.4;
        networkData.interface_errors = 1;

    }

    else if (failure === "latency") {

        networkData.cpu_usage = 38;
        networkData.memory_usage = 46;
        networkData.bandwidth_mbps = 95;
        networkData.latency_ms = 420;
        networkData.packet_loss_percent = 0.6;
        networkData.interface_errors = 2;

    }

    else if (failure === "loss") {

        networkData.cpu_usage = 41;
        networkData.memory_usage = 48;
        networkData.bandwidth_mbps = 87;
        networkData.latency_ms = 24;
        networkData.packet_loss_percent = 25;
        networkData.interface_errors = 2;

    }

    else if (failure === "errors") {

        networkData.cpu_usage = 39;
        networkData.memory_usage = 44;
        networkData.bandwidth_mbps = 91;
        networkData.latency_ms = 21;
        networkData.packet_loss_percent = 0.5;
        networkData.interface_errors = 90;

    }


    // ==========================================
    // SHOW ANALYZING STATE
    // ==========================================

    document.getElementById("diagnosisTitle").innerText =
        "AI ANALYZING...";

    document.getElementById("diagnosisText").innerText =
        "Isolation Forest is analyzing network telemetry...";

    document.getElementById("recommendationText").innerText =
        "Please wait for the AI prediction.";


    const statusBox =
        document.getElementById("diagnosisStatus");

    statusBox.className = "diagnosis-status";
    statusBox.innerText = "● ANALYZING";


    // ==========================================
    // SEND DATA TO REAL AI
    // ==========================================

    try {

        const response = await fetch(
            `${AI_API_URL}/predict`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(networkData)
            }
        );


        if (!response.ok) {
            throw new Error(
                `AI API Error: ${response.status}`
            );
        }


        const result = await response.json();


        console.log("AI RESULT:", result);


        // ==========================================
        // AI RESULT
        // ==========================================

        const risk =
            Math.round(result.risk_score);

        const isAnomaly =
            result.status === "ANOMALY";


        let issue = "Normal";

        let diagnosis =
            "No significant network anomaly detected.";

        let recommendation =
            "No immediate action required. Continue monitoring.";


        // ==========================================
        // DETERMINE ISSUE
        // ==========================================

        if (failure === "cpu") {

            issue = "High CPU";

            diagnosis =
                `The AI analyzed ${device} and detected abnormal CPU behavior. ` +
                `CPU utilization: ${networkData.cpu_usage}%.`;

            recommendation =
                "Inspect CPU-intensive processes, traffic load, and network utilization.";

        }

        else if (failure === "memory") {

            issue = "High Memory";

            diagnosis =
                `The AI analyzed ${device} and detected abnormal memory behavior. ` +
                `Memory utilization: ${networkData.memory_usage}%.`;

            recommendation =
                "Inspect memory-consuming processes and applications.";

        }

        else if (failure === "latency") {

            issue = "High Latency";

            diagnosis =
                `The AI detected abnormal latency on ${device}. ` +
                `Measured latency: ${networkData.latency_ms} ms.`;

            recommendation =
                "Check routing paths, congestion, and interface utilization.";

        }

        else if (failure === "loss") {

            issue = "Packet Loss";

            diagnosis =
                `The AI detected abnormal packet loss on ${device}. ` +
                `Packet loss: ${networkData.packet_loss_percent}%.`;

            recommendation =
                "Inspect interface errors, link quality, and network congestion.";

        }

        else if (failure === "errors") {

            issue = "Interface Errors";

            diagnosis =
                `The AI detected abnormal interface behavior on ${device}. ` +
                `Interface errors: ${networkData.interface_errors}.`;

            recommendation =
                "Inspect the physical interface, cable, duplex settings, and link configuration.";

        }

        else {

            issue = isAnomaly
                ? "AI Detected Anomaly"
                : "Normal";

            diagnosis =
                isAnomaly
                    ? `The Isolation Forest model detected abnormal network behavior on ${device}.`
                    : `${device} is operating within normal network behavior.`;

            recommendation =
                isAnomaly
                    ? "Investigate the affected network metrics and device configuration."
                    : "Continue normal monitoring.";

        }


        // ==========================================
        // UPDATE DASHBOARD
        // ==========================================

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


        // ==========================================
        // STATUS
        // ==========================================

        statusBox.className =
            "diagnosis-status";


        if (isAnomaly || risk >= 75) {

            statusBox.classList.add(
                "critical-status"
            );

            statusBox.innerText =
                "● AI ANOMALY DETECTED";

        }

        else if (risk >= 45) {

            statusBox.classList.add(
                "warning-status"
            );

            statusBox.innerText =
                "● AI WARNING";

        }

        else {

            statusBox.classList.add(
                "normal-status"
            );

            statusBox.innerText =
                "● AI NORMAL";

        }


        // ==========================================
        // UPDATE TOPOLOGY
        // ==========================================

        const deviceElement =
            document.getElementById(device);


        if (deviceElement) {

            deviceElement.classList.remove(
                "normal",
                "critical"
            );


            if (isAnomaly || risk >= 75) {

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


        // ==========================================
        // UPDATE HAIL CARD
        // ==========================================

        if (device === "R4-HAIL") {

            document.getElementById(
                "hailCPU"
            ).innerText =
                networkData.cpu_usage + "%";


            document.getElementById(
                "hailRisk"
            ).innerText =
                risk + "/100";


            document.getElementById(
                "hailBar"
            ).style.width =
                Math.min(risk, 100) + "%";

        }


        // ==========================================
        // ADD ALERT
        // ==========================================

        if (isAnomaly || risk >= 45) {

            addAlert(
                device,
                issue,
                risk
            );

        }

    }


    catch (error) {

        console.error(
            "AI CONNECTION ERROR:",
            error
        );


        document.getElementById(
            "diagnosisTitle"
        ).innerText =
            "AI CONNECTION ERROR";


        document.getElementById(
            "diagnosisText"
        ).innerText =
            "Unable to connect to the NWC AI backend.";


        document.getElementById(
            "recommendationText"
        ).innerText =
            "Check the AI server connection and try again.";


        statusBox.className =
            "diagnosis-status critical-status";


        statusBox.innerText =
            "● AI OFFLINE";

    }

}

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
