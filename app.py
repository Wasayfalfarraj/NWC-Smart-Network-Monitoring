import streamlit as st
import pandas as pd
import numpy as np

from sklearn.ensemble import IsolationForest


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="NWC Smart Network Monitoring",
    page_icon="💧",
    layout="wide",
    initial_sidebar_state="expanded"
)


# =========================================================
# CUSTOM STYLE
# =========================================================

st.markdown("""
<style>

.main {
    background-color: #f7f9fc;
}

.block-container {
    padding-top: 2rem;
    padding-bottom: 3rem;
}

h1, h2, h3 {
    font-weight: 700;
}

.metric-card {
    background: white;
    padding: 22px;
    border-radius: 16px;
    border: 1px solid #e6e9ef;
    box-shadow: 0 3px 12px rgba(0,0,0,0.05);
    text-align: center;
}

.metric-title {
    font-size: 14px;
    color: #6b7280;
}

.metric-value {
    font-size: 30px;
    font-weight: 700;
    margin-top: 5px;
}

.status-normal {
    color: #16a34a;
    font-weight: 700;
}

.status-warning {
    color: #d97706;
    font-weight: 700;
}

.status-critical {
    color: #dc2626;
    font-weight: 700;
}

.alert-card {
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 10px;
    background: white;
    border: 1px solid #e5e7eb;
}

</style>
""", unsafe_allow_html=True)


# =========================================================
# HEADER
# =========================================================

st.title("💧 NWC Smart Network Monitoring")

st.markdown(
    """
    ### AI-Powered Network Anomaly Detection System

    **Network Engineering • Machine Learning • Real-Time Monitoring**
    """
)

st.divider()


# =========================================================
# NETWORK DATA
# =========================================================

np.random.seed(42)

devices = [
    "R1-CORE",
    "R2-RIYADH",
    "R3-QASSIM",
    "R4-HAIL",
    "SW-RIYADH",
    "SW-QASSIM",
    "SW-HAIL"
]

n_samples = 5000

data = pd.DataFrame({
    "timestamp": pd.date_range(
        start="2026-08-01",
        periods=n_samples,
        freq="min"
    ),

    "device": np.random.choice(
        devices,
        n_samples
    ),

    "cpu_usage": np.random.normal(
        35, 10, n_samples
    ).clip(1, 100),

    "memory_usage": np.random.normal(
        45, 12, n_samples
    ).clip(1, 100),

    "bandwidth_mbps": np.random.normal(
        100, 25, n_samples
    ).clip(1, 1000),

    "latency_ms": np.random.normal(
        20, 5, n_samples
    ).clip(1, 500),

    "packet_loss_percent": np.random.normal(
        0.5, 0.4, n_samples
    ).clip(0, 100),

    "interface_errors": np.random.poisson(
        1, n_samples
    )
})


# =========================================================
# MACHINE LEARNING MODEL
# =========================================================

FEATURES = [
    "cpu_usage",
    "memory_usage",
    "bandwidth_mbps",
    "latency_ms",
    "packet_loss_percent",
    "interface_errors"
]

model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)

model.fit(data[FEATURES])

data["prediction"] = model.predict(
    data[FEATURES]
)

data["anomaly"] = (
    data["prediction"] == -1
)


# =========================================================
# ISSUE CLASSIFICATION
# =========================================================

def classify_issue(row):

    if row["cpu_usage"] >= 90:
        return "High CPU"

    if row["memory_usage"] >= 85:
        return "High Memory"

    if row["latency_ms"] >= 100:
        return "High Latency"

    if row["packet_loss_percent"] >= 5:
        return "Packet Loss"

    if row["interface_errors"] >= 50:
        return "Interface Errors"

    if row["anomaly"]:
        return "Unknown"

    return "Normal"


data["issue"] = data.apply(
    classify_issue,
    axis=1
)


# =========================================================
# RISK SCORE
# =========================================================

def calculate_risk(row):

    risk = 0

    if row["cpu_usage"] >= 90:
        risk += 30
    elif row["cpu_usage"] >= 75:
        risk += 15

    if row["memory_usage"] >= 90:
        risk += 25
    elif row["memory_usage"] >= 75:
        risk += 12

    if row["latency_ms"] >= 200:
        risk += 30
    elif row["latency_ms"] >= 100:
        risk += 15

    if row["packet_loss_percent"] >= 10:
        risk += 30
    elif row["packet_loss_percent"] >= 5:
        risk += 15

    if row["interface_errors"] >= 50:
        risk += 25
    elif row["interface_errors"] >= 10:
        risk += 12

    return min(risk, 100)


data["risk_score"] = data.apply(
    calculate_risk,
    axis=1
)


# =========================================================
# NETWORK METRICS
# =========================================================

total_devices = data["device"].nunique()

total_records = len(data)

total_anomalies = int(
    data["anomaly"].sum()
)

normal_records = (
    total_records - total_anomalies
)

normal_percentage = (
    normal_records / total_records
) * 100


# =========================================================
# SIDEBAR
# =========================================================

st.sidebar.title("💧 NWC Monitoring")

st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Overview",
        "🖥️ Device Monitoring",
        "🚨 Alerts",
        "🧪 Failure Simulator"
    ]
)

st.sidebar.markdown("---")

st.sidebar.success(
    "● Monitoring System Online"
)

st.sidebar.caption(
    "AI Engine: Isolation Forest"
)

st.sidebar.caption(
    f"Monitoring {total_devices} devices"
)


# =========================================================
# OVERVIEW PAGE
# =========================================================

if page == "🏠 Overview":

    st.header("Network Overview")

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "🖥️ Network Devices",
            total_devices
        )

    with col2:
        st.metric(
            "🟢 Normal Records",
            f"{normal_percentage:.1f}%"
        )

    with col3:
        st.metric(
            "🚨 Detected Anomalies",
            total_anomalies
        )

    with col4:
        st.metric(
            "🤖 AI Model",
            "Isolation Forest"
        )

    st.divider()

    # -----------------------------------------
    # NETWORK TOPOLOGY
    # -----------------------------------------

    st.subheader("🌐 Network Topology")

    topology = pd.DataFrame({
        "Device": devices,
        "Status": [
            "🟢 Normal",
            "🟢 Normal",
            "🟢 Normal",
            "🔴 Alert",
            "🟢 Normal",
            "🟢 Normal",
            "🟢 Normal"
        ]
    })

    st.dataframe(
        topology,
        use_container_width=True,
        hide_index=True
    )

    st.divider()

    # -----------------------------------------
    # ISSUE DISTRIBUTION
    # -----------------------------------------

    st.subheader("📊 Detected Issues")

    issue_counts = (
        data[data["anomaly"]]
        ["issue"]
        .value_counts()
    )

    st.bar_chart(issue_counts)

    st.divider()

    # -----------------------------------------
    # RECENT ALERTS
    # -----------------------------------------

    st.subheader("🚨 Recent Alerts")

    recent = (
        data[data["anomaly"]]
        .sort_values(
            "timestamp",
            ascending=False
        )
        .head(10)
    )

    st.dataframe(
        recent[
            [
                "timestamp",
                "device",
                "issue",
                "risk_score",
                "cpu_usage",
                "memory_usage",
                "latency_ms",
                "packet_loss_percent"
            ]
        ],
        use_container_width=True,
        hide_index=True
    )


# =========================================================
# DEVICE MONITORING
# =========================================================

elif page == "🖥️ Device Monitoring":

    st.header("🖥️ Device Monitoring")

    selected_device = st.selectbox(
        "Select Network Device",
        devices
    )

    device_data = data[
        data["device"] == selected_device
    ]

    latest = device_data.iloc[-1]

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "CPU",
            f"{latest['cpu_usage']:.1f}%"
        )

    with col2:
        st.metric(
            "Memory",
            f"{latest['memory_usage']:.1f}%"
        )

    with col3:
        st.metric(
            "Latency",
            f"{latest['latency_ms']:.1f} ms"
        )

    with col4:
        st.metric(
            "Packet Loss",
            f"{latest['packet_loss_percent']:.2f}%"
        )

    st.divider()

    st.subheader(
        f"📈 Performance — {selected_device}"
    )

    chart_data = device_data[
        [
            "timestamp",
            "cpu_usage",
            "memory_usage"
        ]
    ].set_index("timestamp")

    st.line_chart(chart_data)

    st.divider()

    st.subheader("🚨 Device Alerts")

    device_alerts = device_data[
        device_data["anomaly"]
    ]

    st.dataframe(
        device_alerts[
            [
                "timestamp",
                "issue",
                "risk_score",
                "cpu_usage",
                "memory_usage",
                "latency_ms",
                "packet_loss_percent",
                "interface_errors"
            ]
        ],
        use_container_width=True,
        hide_index=True
    )


# =========================================================
# ALERTS PAGE
# =========================================================

elif page == "🚨 Alerts":

    st.header("🚨 Network Alerts")

    alerts = data[
        data["anomaly"]
    ].sort_values(
        "risk_score",
        ascending=False
    )

    st.write(
        f"Detected **{len(alerts)}** anomalous records."
    )

    for _, row in alerts.head(15).iterrows():

        if row["risk_score"] >= 75:
            status = "🔴 CRITICAL"
        elif row["risk_score"] >= 45:
            status = "🟠 HIGH"
        elif row["risk_score"] >= 20:
            status = "🟡 MEDIUM"
        else:
            status = "🟢 LOW"

        with st.container(border=True):

            st.markdown(
                f"""
                ### {status} — {row['device']}

                **Issue:** {row['issue']}  
                **Risk Score:** {row['risk_score']}/100  
                **Time:** {row['timestamp']}
                """
            )

            if row["issue"] == "High CPU":
                st.info(
                    "Recommended Action: Check CPU-intensive "
                    "processes and traffic load."
                )

            elif row["issue"] == "High Latency":
                st.info(
                    "Recommended Action: Check routing path, "
                    "congestion and interface utilization."
                )

            elif row["issue"] == "Packet Loss":
                st.info(
                    "Recommended Action: Inspect interface "
                    "errors, link quality and congestion."
                )

            elif row["issue"] == "Interface Errors":
                st.info(
                    "Recommended Action: Inspect physical "
                    "interface and link configuration."
                )

            elif row["issue"] == "High Memory":
                st.info(
                    "Recommended Action: Inspect memory-consuming "
                    "processes."
                )


# =========================================================
# FAILURE SIMULATOR
# =========================================================

elif page == "🧪 Failure Simulator":

    st.header("🧪 Live Network Failure Simulator")

    st.markdown(
        """
        Simulate a network failure and observe how the
        monitoring system responds.
        """
    )

    selected_device = st.selectbox(
        "Select Device",
        devices
    )

    failure = st.selectbox(
        "Inject Failure",
        [
            "Normal",
            "High CPU",
            "High Memory",
            "High Latency",
            "Packet Loss",
            "Interface Errors"
        ]
    )

    if st.button(
        "🚨 ANALYZE NETWORK",
        use_container_width=True
    ):

        cpu = 40
        memory = 50
        latency = 20
        packet_loss = 0.5
        errors = 1

        if failure == "High CPU":
            cpu = 96

        elif failure == "High Memory":
            memory = 94

        elif failure == "High Latency":
            latency = 350

        elif failure == "Packet Loss":
            packet_loss = 15

        elif failure == "Interface Errors":
            errors = 85

        test_row = pd.Series({
            "cpu_usage": cpu,
            "memory_usage": memory,
            "latency_ms": latency,
            "packet_loss_percent": packet_loss,
            "interface_errors": errors,
            "anomaly": True
        })

        issue = classify_issue(
            test_row
        )

        risk = calculate_risk(
            test_row
        )

        st.divider()

        if risk >= 75:
            st.error("🔴 CRITICAL NETWORK CONDITION")

        elif risk >= 45:
            st.warning("🟠 HIGH RISK NETWORK CONDITION")

        elif risk >= 20:
            st.warning("🟡 MEDIUM RISK NETWORK CONDITION")

        else:
            st.success("🟢 NETWORK CONDITION NORMAL")

        col1, col2 = st.columns(2)

        with col1:

            st.metric(
                "Detected Issue",
                issue
            )

        with col2:

            st.metric(
                "Risk Score",
                f"{risk}/100"
            )

        st.subheader("📊 Incident Metrics")

        metrics = pd.DataFrame({
            "Metric": [
                "CPU",
                "Memory",
                "Latency",
                "Packet Loss",
                "Interface Errors"
            ],

            "Value": [
                cpu,
                memory,
                latency,
                packet_loss,
                errors
            ]
        })

        st.bar_chart(
            metrics.set_index("Metric")
        )

        st.subheader("🤖 AI Diagnosis")

        if issue == "High CPU":

            st.info(
                """
                **Possible Cause:** High processing load.

                **Recommended Action:** Inspect CPU-intensive
                processes and traffic load on the device.
                """
            )

        elif issue == "High Memory":

            st.info(
                """
                **Possible Cause:** High memory utilization.

                **Recommended Action:** Inspect memory-consuming
                processes and applications.
                """
            )

        elif issue == "High Latency":

            st.info(
                """
                **Possible Cause:** Network congestion or
                routing issue.

                **Recommended Action:** Check routing paths,
                congestion and interface utilization.
                """
            )

        elif issue == "Packet Loss":

            st.info(
                """
                **Possible Cause:** Link quality or congestion.

                **Recommended Action:** Inspect interface errors,
                link quality and network congestion.
                """
            )

        elif issue == "Interface Errors":

            st.info(
                """
                **Possible Cause:** Physical/interface problem.

                **Recommended Action:** Inspect the interface,
                cable and link configuration.
                """
            )

        else:

            st.success(
                "No significant network anomaly detected."
            )


# =========================================================
# FOOTER
# =========================================================

st.divider()

st.caption(
    "NWC Smart Network Monitoring • "
    "AI-based network anomaly detection prototype"
)
