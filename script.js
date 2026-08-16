// =====================================================
// NWC SMART NETWORK MONITORING
// Interactive Dashboard + AI Anomaly Detection
// =====================================================


// =====================================================
// AI API
// =====================================================

const AI_API_URL =
    "https://nwc-smart-network-monitoring.onrender.com";


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, button) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active-page");
        });

    const selectedPage =
        document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    if (button) {
        button.classList.add("active");
    }

    // On phones/tablets the sidebar is an off-canvas drawer —
    // close it once a destination has been picked.
    closeSidebar();
}


// =====================================================
// MOBILE SIDEBAR (off-canvas drawer)
// =====================================================

function openSidebar() {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("show");
}

function closeSidebar() {

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
}


// =====================================================
// NETWORK CHART
// =====================================================

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

let networkChart = null;


// Only create chart if canvas exists
if (chartCanvas) {

    networkChart =
        new Chart(
            chartCanvas,
            {
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

            }
        );

}


// =====================================================
// REAL AI FAILURE ANALYSIS
// =====================================================

async function analyzeFailure() {

    const deviceElement =
        document.getElementById("deviceSelect");

    const failureElement =
        document.getElementById("failureSelect");


    if (!deviceElement || !failureElement) {

        console.error(
            "Device or failure selector not found."
        );

        return;

    }


    const device =
        deviceElement.value;

    const failure =
        failureElement.value;


    // =================================================
    // DEFAULT NETWORK DATA
    // =================================================

    let networkData = {

        cpu_usage: 35,

        memory_usage: 45,

        bandwidth_mbps: 100,

        latency_ms: 20,

        packet_loss_percent: 0.5,

        interface_errors: 1

    };


    // =================================================
    // FAILURE SIMULATION
    // =================================================

    if (failure === "cpu") {

        networkData = {

            cpu_usage: 97,

            memory_usage: 53,

            bandwidth_mbps: 104,

            latency_ms: 21,

            packet_loss_percent: 0.2,

            interface_errors: 1

        };

    }


    else if (failure === "memory") {

        networkData = {

            cpu_usage: 42,

            memory_usage: 92,

            bandwidth_mbps: 98,

            latency_ms: 22,

            packet_loss_percent: 0.4,

            interface_errors: 1

        };

    }


    else if (failure === "latency") {

        networkData = {

            cpu_usage: 38,

            memory_usage: 46,

            bandwidth_mbps: 95,

            latency_ms: 420,

            packet_loss_percent: 0.6,

            interface_errors: 2

        };

    }


    else if (failure === "loss") {

        networkData = {

            cpu_usage: 41,

            memory_usage: 48,

            bandwidth_mbps: 87,

            latency_ms: 24,

            packet_loss_percent: 25,

            interface_errors: 2

        };

    }


    else if (failure === "errors") {

        networkData = {

            cpu_usage: 39,

            memory_usage: 44,

            bandwidth_mbps: 91,

            latency_ms: 21,

            packet_loss_percent: 0.5,

            interface_errors: 90

        };

    }


    // =================================================
    // CHECK DASHBOARD ELEMENTS
    // =================================================

    const diagnosisTitle =
        document.getElementById(
            "diagnosisTitle"
        );

    const riskScoreElement =
        document.getElementById(
            "riskScore"
        );

    const diagnosisText =
        document.getElementById(
            "diagnosisText"
        );

    const recommendationText =
        document.getElementById(
            "recommendationText"
        );

    const statusBox =
        document.getElementById(
            "diagnosisStatus"
        );


    // =================================================
    // ANALYZING STATE
    // =================================================

    if (diagnosisTitle) {

        diagnosisTitle.innerText =
            "AI ANALYZING...";

    }


    if (riskScoreElement) {

        riskScoreElement.innerText =
            "...";

    }


    if (diagnosisText) {

        diagnosisText.innerText =
            "Isolation Forest is analyzing network telemetry...";

    }


    if (recommendationText) {

        recommendationText.innerText =
            "Please wait for the AI prediction.";

    }


    if (statusBox) {

        statusBox.className =
            "diagnosis-status";

        statusBox.innerText =
            "● ANALYZING";

    }


    // =================================================
    // SEND DATA TO REAL AI API
    // =================================================

    try {

        const response =
            await fetch(
                `${AI_API_URL}/predict`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            networkData
                        )

                }
            );


        if (!response.ok) {

            throw new Error(
                `AI API Error: ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "REAL AI RESULT:",
            result
        );


        // =================================================
        // AI RESULT
        // =================================================

        const risk =
            Math.round(
                result.risk_score
            );


        const isAnomaly =
            result.status === "ANOMALY";


        let issue =
            "Normal";


        let diagnosis =
            "No significant network anomaly detected.";


        let recommendation =
            "No immediate action required. Continue monitoring.";


        // =================================================
        // ISSUE IDENTIFICATION
        // =================================================

        if (failure === "cpu") {

            issue =
                "High CPU";

            diagnosis =
                `The AI analyzed ${device} and detected abnormal CPU behavior. CPU utilization is ${networkData.cpu_usage}%.`;

            recommendation =
                "Inspect CPU-intensive processes, traffic load, and current network utilization.";

        }


        else if (failure === "memory") {

            issue =
                "High Memory";

            diagnosis =
                `The AI analyzed ${device} and detected abnormal memory behavior. Memory utilization is ${networkData.memory_usage}%.`;

            recommendation =
                "Inspect memory-consuming processes and applications.";

        }


        else if (failure === "latency") {

            issue =
                "High Latency";

            diagnosis =
                `The AI detected abnormal latency on ${device}. Measured latency is ${networkData.latency_ms} ms.`;

            recommendation =
                "Check routing paths, congestion, and interface utilization.";

        }


        else if (failure === "loss") {

            issue =
                "Packet Loss";

            diagnosis =
                `The AI detected abnormal packet loss on ${device}. Packet loss is ${networkData.packet_loss_percent}%.`;

            recommendation =
                "Inspect interface errors, link quality, and network congestion.";

        }


        else if (failure === "errors") {

            issue =
                "Interface Errors";

            diagnosis =
                `The AI detected abnormal interface behavior on ${device}. Interface errors: ${networkData.interface_errors}.`;

            recommendation =
                "Inspect the physical interface, cable, duplex settings, and link configuration.";

        }


        else {

            issue =
                isAnomaly
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


        // =================================================
        // UPDATE DASHBOARD
        // =================================================

        if (diagnosisTitle) {

            diagnosisTitle.innerText =
                issue;

        }


        if (riskScoreElement) {

            riskScoreElement.innerText =
                risk;

        }


        if (diagnosisText) {

            diagnosisText.innerText =
                diagnosis;

        }


        if (recommendationText) {

            recommendationText.innerText =
                recommendation;

        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        if (statusBox) {

            statusBox.className =
                "diagnosis-status";


            if (
                isAnomaly ||
                risk >= 75
            ) {

                statusBox.classList.add(
                    "critical-status"
                );

                statusBox.innerText =
                    "● AI ANOMALY DETECTED";

            }


            else if (
                risk >= 45
            ) {

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

        }


        // =================================================
        // UPDATE TOPOLOGY
        // =================================================

        const topologyDevice =
            document.getElementById(
                device
            );


        if (topologyDevice) {

            topologyDevice.classList.remove(
                "normal",
                "critical"
            );


            if (
                isAnomaly ||
                risk >= 75
            ) {

                topologyDevice.classList.add(
                    "critical"
                );

            }

            else {

                topologyDevice.classList.add(
                    "normal"
                );

            }

        }


        // =================================================
        // UPDATE HAIL CARD
        // =================================================

        if (
            device === "R4-HAIL"
        ) {

            const hailCPU =
                document.getElementById(
                    "hailCPU"
                );

            const hailRisk =
                document.getElementById(
                    "hailRisk"
                );

            const hailBar =
                document.getElementById(
                    "hailBar"
                );


            if (hailCPU) {

                hailCPU.innerText =
                    networkData.cpu_usage +
                    "%";

            }


            if (hailRisk) {

                hailRisk.innerText =
                    risk +
                    "/100";

            }


            if (hailBar) {

                hailBar.style.width =
                    Math.min(
                        risk,
                        100
                    ) +
                    "%";

            }

        }


        // =================================================
        // ADD ALERT
        // =================================================

        if (
            isAnomaly ||
            risk >= 45
        ) {

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


        if (diagnosisTitle) {

            diagnosisTitle.innerText =
                "AI CONNECTION ERROR";

        }


        if (riskScoreElement) {

            riskScoreElement.innerText =
                "--";

        }


        if (diagnosisText) {

            diagnosisText.innerText =
                "Unable to connect to the NWC AI backend.";

        }


        if (recommendationText) {

            recommendationText.innerText =
                "Check the AI server connection and try again.";

        }


        if (statusBox) {

            statusBox.className =
                "diagnosis-status critical-status";

            statusBox.innerText =
                "● AI OFFLINE";

        }

    }

}


// =====================================================
// ADD ALERT TO DASHBOARD
// =====================================================

function addAlert(
    device,
    issue,
    risk
) {

    const alertsList =
        document.getElementById(
            "alertsList"
        );


    if (!alertsList) {

        return;

    }


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
                AI Risk Score: ${risk}/100
            </small>

        </div>

        <span class="alert-time">
            NOW
        </span>

    `;


    alertsList.prepend(
        alert
    );


    // =================================================
    // UPDATE ALERT COUNTER
    // =================================================

    const counter =
        document.getElementById(
            "alertCount"
        );


    if (counter) {

        let count =
            parseInt(
                counter.innerText
            );


        if (isNaN(count)) {

            count = 0;

        }


        counter.innerText =
            count + 1;

    }

}


// =====================================================
// DEVICE CHART SWITCHER
// =====================================================

const chartDevice =
    document.getElementById(
        "chartDevice"
    );


if (
    chartDevice &&
    networkChart
) {

    chartDevice.addEventListener(
        "change",
        function () {

            const selected =
                this.value;


            const randomOffset =
                Math.floor(
                    Math.random() * 15
                );


            networkChart
                .data
                .datasets[0]
                .data =
                cpuData.map(
                    value =>
                        Math.min(
                            value +
                            randomOffset,
                            100
                        )
                );


            networkChart
                .update();

        }
    );

}


// =====================================================
// WELCOME SCREEN
// =====================================================

function enterDashboard() {

    const welcomeScreen =
        document.getElementById(
            "welcome-screen"
        );


    if (welcomeScreen) {

        welcomeScreen.style.display =
            "none";

    }

}
