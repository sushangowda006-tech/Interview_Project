import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const s = {
    screen:  { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:   { color: "#f8fafc", fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" },
    adminBadge: { backgroundColor: "#ef4444", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "99px", textTransform: "uppercase" },
    backBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:    { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1100px", width: "100%", margin: "0 auto", paddingBottom: "48px" },

    hero:    { background: "linear-gradient(135deg, #1e293b 0%, #7c3aed 100%)", borderRadius: "16px", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
    heroGlow:{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", top: "-60px", right: "-40px" },
    heroLeft:{ zIndex: 1 },
    heroTitle:{ fontSize: "26px", fontWeight: "800", color: "#fff", margin: "0 0 4px" },
    heroSub: { fontSize: "14px", color: "#c4b5fd", margin: 0 },
    heroStats:{ display: "flex", gap: "32px", zIndex: 1 },
    heroStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
    heroStatVal:  { fontSize: "28px", fontWeight: "900", color: "#fcd34d" },
    heroStatLabel:{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },

    summaryRow:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
    summaryCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0" },
    summaryIcon: { width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 },
    summaryVal:  { fontSize: "22px", fontWeight: "800", lineHeight: 1 },
    summaryLbl:  { fontSize: "12px", color: "#64748b", fontWeight: "500" },

    sectionLabel: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },
    table:     { backgroundColor: "#ffffff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    tableHead: { display: "grid", gridTemplateColumns: "60px 2fr 1.5fr 1fr 1fr 1fr 1.2fr", padding: "13px 24px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" },
    tableHCell:{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    tableRow:  { display: "grid", gridTemplateColumns: "60px 2fr 1.5fr 1fr 1fr 1fr 1.2fr", padding: "14px 24px", borderBottom: "1px solid #f1f5f9", alignItems: "center", transition: "background 0.15s ease" },
    avatar:    { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "#fff", flexShrink: 0 },
    badge:     { fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "99px", display: "inline-block" },
    barWrap:   { display: "flex", alignItems: "center", gap: "8px" },
    barTrack:  { flex: 1, height: "7px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    barFill:   { height: "100%", borderRadius: "99px" },

    emptyWrap: { backgroundColor: "#ffffff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    errorBox:  { backgroundColor: "#fee2e2", color: "#b91c1c", padding: "14px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "500" },
};

const AVATAR_COLORS = ["#3b82f6","#22c55e","#f59e0b","#a855f7","#ef4444","#0ea5e9","#ec4899","#14b8a6"];
function avatarColor(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function scoreColor(pct) {
    if (pct >= 85) return "#22c55e";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
}
function getBadge(pct) {
    if (pct >= 85) return { label: "Excellent", bg: "#dcfce7", color: "#15803d" };
    if (pct >= 60) return { label: "Good",      bg: "#fef3c7", color: "#92400e" };
    return              { label: "Needs Work", bg: "#fee2e2", color: "#b91c1c" };
}

function Admin() {
    const navigate  = useNavigate();
    const [results,  setResults]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState("");
    const [hovered,  setHovered]  = useState(null);
    const [search,   setSearch]   = useState("");

    useEffect(() => {
        API.get("/results/admin/all")
            .then(res => { setResults(res.data); setLoading(false); })
            .catch(err => {
                setError(err.response?.status === 403
                    ? "❌ Access denied. Admin role required."
                    : "❌ Failed to load results. Is the backend running?");
                setLoading(false);
            });
    }, []);

    const filtered = results.filter(r =>
        (r.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.topic || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalUsers    = [...new Set(results.map(r => r.email))].length;
    const avgPct        = results.length ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0;
    const topPct        = results.length ? Math.max(...results.map(r => r.percentage)) : 0;
    const passCount     = results.filter(r => r.percentage >= 60).length;

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <div style={s.brand}>
                    <span>• Interview System</span>
                    <span style={s.adminBadge}>Admin</span>
                </div>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>

            <main style={s.main} className="page-enter">

                {/* Hero */}
                <div style={s.hero}>
                    <div style={s.heroGlow} />
                    <div style={s.heroLeft}>
                        <h1 style={s.heroTitle}>🛡️ Admin Panel</h1>
                        <p style={s.heroSub}>All registered users' quiz results</p>
                    </div>
                    <div style={s.heroStats}>
                        <div style={s.heroStat}><span style={s.heroStatVal}>{results.length}</span><span style={s.heroStatLabel}>Total Attempts</span></div>
                        <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
                        <div style={s.heroStat}><span style={s.heroStatVal}>{totalUsers}</span><span style={s.heroStatLabel}>Users</span></div>
                        <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
                        <div style={s.heroStat}><span style={s.heroStatVal}>{avgPct}%</span><span style={s.heroStatLabel}>Avg Score</span></div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div style={s.summaryRow}>
                    {[
                        { icon: "👥", iconBg: "#eff6ff", val: totalUsers,          label: "Registered Users",  color: "#3b82f6" },
                        { icon: "📝", iconBg: "#f0fdf4", val: results.length,      label: "Total Attempts",    color: "#22c55e" },
                        { icon: "🏆", iconBg: "#fef3c7", val: `${topPct}%`,        label: "Highest Score",     color: "#f59e0b" },
                        { icon: "✅", iconBg: "#f0fdf4", val: passCount,           label: "Passed (≥60%)",     color: "#22c55e" },
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

                {/* Error */}
                {error && <div style={s.errorBox}>{error}</div>}

                {/* Results Table */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={s.sectionLabel}>📋 All Quiz Attempts</p>
                        <input
                            placeholder="🔍 Search by email or topic..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "13px", outline: "none", width: "260px", backgroundColor: "#fff" }}
                        />
                    </div>

                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "56px" }} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={s.emptyWrap}>
                            <span style={{ fontSize: "56px" }}>📊</span>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
                                {results.length === 0 ? "No quiz attempts yet" : "No results match your search"}
                            </h2>
                            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                                {results.length === 0 ? "Results will appear here once users complete quizzes." : "Try a different search term."}
                            </p>
                        </div>
                    ) : (
                        <div style={s.table}>
                            <div style={s.tableHead}>
                                <span style={s.tableHCell}>#</span>
                                <span style={s.tableHCell}>User</span>
                                <span style={s.tableHCell}>Topic</span>
                                <span style={s.tableHCell}>Score</span>
                                <span style={s.tableHCell}>Total Qs</span>
                                <span style={s.tableHCell}>Date</span>
                                <span style={s.tableHCell}>Performance</span>
                            </div>
                            {filtered.map((r, i) => {
                                const pct    = Math.round(r.percentage);
                                const sc     = scoreColor(pct);
                                const badge  = getBadge(pct);
                                const email  = r.email || `User #${r.userId}`;
                                const ac     = avatarColor(email);
                                return (
                                    <div
                                        key={r.id}
                                        style={{ ...s.tableRow, backgroundColor: hovered === i ? "#f8fafc" : "#ffffff" }}
                                        onMouseEnter={() => setHovered(i)}
                                        onMouseLeave={() => setHovered(null)}
                                    >
                                        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>#{i + 1}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{ ...s.avatar, backgroundColor: ac }}>{email[0].toUpperCase()}</div>
                                            <div>
                                                <p style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", margin: 0 }}>{email.split("@")[0]}</p>
                                                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{email}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{r.topic || "—"}</span>
                                        <span style={{ fontSize: "15px", fontWeight: "800", color: sc }}>{pct}%</span>
                                        <span style={{ fontSize: "13px", color: "#64748b" }}>{r.totalQuestions} Qs</span>
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>{r.attemptDate || "—"}</span>
                                        <div style={s.barWrap}>
                                            <div style={s.barTrack}>
                                                <div style={{ ...s.barFill, width: `${pct}%`, backgroundColor: sc }} />
                                            </div>
                                            <span style={{ ...s.badge, backgroundColor: badge.bg, color: badge.color }}>{badge.label}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

export default Admin;
