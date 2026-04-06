import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

const s = {
    screen:  { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:   { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:    { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "28px", maxWidth: "1000px", width: "100%", margin: "0 auto", paddingBottom: "48px" },
    header:  { display: "flex", alignItems: "center", gap: "14px" },
    iconWrap:{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" },
    title:   { fontSize: "26px", fontWeight: "800", color: "#1e293b", margin: 0 },
    subtitle:{ fontSize: "14px", color: "#64748b", margin: 0 },
    card:    { backgroundColor: "#ffffff", borderRadius: "14px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0" },
    cardTitle:{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px" },
    summaryRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    summaryCard:{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0" },
    summaryIcon:{ width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 },
    summaryVal: { fontSize: "22px", fontWeight: "800", lineHeight: 1 },
    summaryLbl: { fontSize: "12px", color: "#64748b", fontWeight: "500" },
    emptyWrap:  { backgroundColor: "#ffffff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    emptyBtn:   { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "8px" },
};

const TOPIC_COLORS = {
    "Java OOP":        "#f59e0b",
    "Spring Boot":     "#22c55e",
    "SQL & Databases": "#3b82f6",
    "React Basics":    "#a855f7",
    "REST APIs":       "#0ea5e9",
    "Security & JWT":  "#ec4899",
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ backgroundColor: "#1e293b", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", color: "#f8fafc" }}>
            <p style={{ margin: "0 0 4px", fontWeight: "700" }}>{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ margin: 0, color: p.color }}>{p.name}: {p.value}%</p>
            ))}
        </div>
    );
};

function ScoreHistory() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token") || "";
        let email = "";
        try { email = JSON.parse(atob(token.split(".")[1])).sub || ""; } catch {}
        const all = JSON.parse(localStorage.getItem("leaderboard") || "[]");
        setResults(all.filter(r => r.name === email));
    }, []);

    if (results.length === 0) return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>
            <main style={s.main} className="page-enter">
                <div style={s.emptyWrap}>
                    <span style={{ fontSize: "56px" }}>📈</span>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>No score history yet</h2>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Complete quizzes to see your progress chart here.</p>
                    <button style={s.emptyBtn} onClick={() => navigate("/quiz")}>🧠 Take a Quiz</button>
                </div>
            </main>
        </div>
    );

    // Line chart data — attempts over time
    const lineData = results.map((r, i) => ({
        attempt: `#${i + 1}`,
        score: r.score,
        topic: r.topic,
    }));

    // Bar chart data — best score per topic
    const topicMap = {};
    results.forEach(r => {
        if (!topicMap[r.topic] || r.score > topicMap[r.topic]) topicMap[r.topic] = r.score;
    });
    const barData = Object.entries(topicMap).map(([topic, score]) => ({ topic: topic.split(" ")[0], score, full: topic }));

    const best = Math.max(...results.map(r => r.score));
    const avg  = Math.round(results.reduce((a, r) => a + r.score, 0) / results.length);
    const total = results.length;

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>

            <main style={s.main} className="page-enter">

                <div style={s.header}>
                    <div style={s.iconWrap}>📈</div>
                    <div>
                        <h1 style={s.title}>Score History</h1>
                        <p style={s.subtitle}>Your performance over time</p>
                    </div>
                </div>

                {/* Summary */}
                <div style={s.summaryRow}>
                    {[
                        { icon: "📝", iconBg: "#eff6ff", val: total,    label: "Total Attempts", color: "#3b82f6" },
                        { icon: "🏆", iconBg: "#fef3c7", val: `${best}%`, label: "Best Score",   color: "#f59e0b" },
                        { icon: "📊", iconBg: "#f0fdf4", val: `${avg}%`,  label: "Average Score", color: "#22c55e" },
                    ].map(st => (
                        <div key={st.label} style={s.summaryCard}>
                            <div style={{ ...s.summaryIcon, backgroundColor: st.iconBg }}>{st.icon}</div>
                            <div>
                                <p style={{ ...s.summaryVal, color: st.color, margin: 0 }}>{st.val}</p>
                                <p style={{ ...s.summaryLbl, margin: 0 }}>{st.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Line Chart — Score over attempts */}
                <div style={s.card}>
                    <p style={s.cardTitle}>📉 Score Trend (All Attempts)</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="attempt" tick={{ fontSize: 12, fill: "#64748b" }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} unit="%" />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone" dataKey="score" name="Score"
                                stroke="#3b82f6" strokeWidth={3}
                                dot={{ fill: "#3b82f6", r: 5 }}
                                activeDot={{ r: 7, fill: "#1d4ed8" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart — Best score per topic */}
                <div style={s.card}>
                    <p style={s.cardTitle}>🏅 Best Score Per Topic</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="topic" tick={{ fontSize: 12, fill: "#64748b" }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#64748b" }} unit="%" />
                            <Tooltip
                                formatter={(val, _, props) => [`${val}%`, props.payload.full]}
                                contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", color: "#f8fafc", fontSize: "13px" }}
                            />
                            <Bar dataKey="score" name="Best Score" radius={[6, 6, 0, 0]}
                                fill="#3b82f6"
                                label={{ position: "top", fontSize: 11, fill: "#64748b", formatter: v => `${v}%` }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </main>
        </div>
    );
}

export default ScoreHistory;
