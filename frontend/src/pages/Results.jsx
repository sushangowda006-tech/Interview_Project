import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const s = {
    screen:  { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:   { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:    { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "960px", width: "100%", margin: "0 auto", paddingBottom: "48px" },
    header:  { display: "flex", alignItems: "center", gap: "14px" },
    iconWrap:{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" },
    title:   { fontSize: "26px", fontWeight: "800", color: "#1e293b", margin: 0 },
    subtitle:{ fontSize: "14px", color: "#64748b", margin: 0 },

    // Summary row
    summaryRow:  { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    summaryCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0" },
    summaryIcon: { width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 },
    summaryVal:  { fontSize: "22px", fontWeight: "800", lineHeight: 1 },
    summaryLbl:  { fontSize: "12px", color: "#64748b", fontWeight: "500" },

    // Table
    sectionLabel: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },
    table:     { backgroundColor: "#ffffff", borderRadius: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1.5px solid #e2e8f0", overflow: "hidden" },
    tableHead: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 24px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" },
    tableHCell:{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    tableRow:  { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid #f1f5f9", alignItems: "center", transition: "background 0.15s ease" },
    badge:     { fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "99px", display: "inline-block" },

    // Empty state
    emptyWrap: { backgroundColor: "#ffffff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    emptyBtn:  { backgroundColor: "#22c55e", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 14px rgba(34,197,94,0.3)" },
};

function getBadge(score) {
    if (score >= 85) return { label: "Excellent", bg: "#dcfce7", color: "#15803d" };
    if (score >= 60) return { label: "Good",      bg: "#fef3c7", color: "#92400e" };
    return                  { label: "Needs Work", bg: "#fee2e2", color: "#b91c1c" };
}

function getScoreColor(score) {
    if (score >= 85) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
}

function Results() {
    const navigate = useNavigate();
    const [results,  setResults]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [hovered,  setHovered]  = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Read current user's results from leaderboard in localStorage
            const token = localStorage.getItem("token") || "";
            let email = "";
            try { email = JSON.parse(atob(token.split(".")[1])).sub || ""; } catch {}

            const all = JSON.parse(localStorage.getItem("leaderboard") || "[]");
            const mine = all.filter(r => r.name === email);
            setResults(mine);
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const best = results.length ? Math.max(...results.map(r => r.score)) : 0;
    const avg  = results.length ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
            </nav>

            <main style={s.main} className="page-enter">

                {/* Header */}
                <div style={s.header}>
                    <div style={s.iconWrap}>📊</div>
                    <div>
                        <h1 style={s.title}>My Results</h1>
                        <p style={s.subtitle}>All your quiz attempts in one place</p>
                    </div>
                </div>

                {/* Loading Skeleton */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "80px" }} />)}
                        </div>
                        <div className="skeleton" style={{ height: "280px" }} />
                    </div>
                ) : results.length === 0 ? (
                    /* Empty State */
                    <div style={s.emptyWrap}>
                        <span style={{ fontSize: "64px" }}>📊</span>
                        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>No results yet!</h2>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Complete a quiz to see your results here.</p>
                        <button style={s.emptyBtn} onClick={() => navigate("/quiz")}>
                            🧠 Take a Quiz Now
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div style={s.summaryRow} className="summary-row">
                            {[
                                { icon: "📝", iconBg: "#eff6ff", val: results.length, label: "Total Attempts", color: "#3b82f6" },
                                { icon: "🏆", iconBg: "#fef3c7", val: `${best}%`,     label: "Best Score",     color: "#f59e0b" },
                                { icon: "📈", iconBg: "#f0fdf4", val: `${avg}%`,      label: "Average Score",  color: "#22c55e" },
                            ].map(stat => (
                                <div key={stat.label} style={s.summaryCard}>
                                    <div style={{ ...s.summaryIcon, backgroundColor: stat.iconBg }}>{stat.icon}</div>
                                    <div>
                                        <p style={{ ...s.summaryVal, color: stat.color, margin: 0 }}>{stat.val}</p>
                                        <p style={{ ...s.summaryLbl, margin: 0 }}>{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Results Table */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <p style={s.sectionLabel}>📋 Attempt History</p>
                            <div style={s.table}>
                                <div style={s.tableHead}>
                                    <span style={s.tableHCell}>Topic</span>
                                    <span style={s.tableHCell}>Date</span>
                                    <span style={s.tableHCell}>Score</span>
                                    <span style={s.tableHCell}>Status</span>
                                </div>
                                {results.map((r, i) => {
                                    const badge = getBadge(r.score);
                                    return (
                                        <div
                                            key={i}
                                            style={{ ...s.tableRow, backgroundColor: hovered === i ? "#f8fafc" : "#ffffff" }}
                                            onMouseEnter={() => setHovered(i)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>{r.topic}</span>
                                            <span style={{ fontSize: "13px", color: "#64748b" }}>{r.date}</span>
                                            <span style={{ fontSize: "15px", fontWeight: "700", color: getScoreColor(r.score) }}>{r.score}%</span>
                                            <span style={{ ...s.badge, backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}

export default Results;
