import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStreak } from "../utils/streak";

function parseToken(token) {
    try { return JSON.parse(atob(token.split(".")[1])); } catch { return {}; }
}

const AVATAR_COLORS = ["#3b82f6","#22c55e","#f59e0b","#a855f7","#ef4444","#0ea5e9"];
function avatarColor(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const s = {
    screen:   { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:   { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:    { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn:  { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:     { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "860px", width: "100%", margin: "0 auto", paddingBottom: "48px" },

    // Profile hero card
    heroCard: { background: "linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)", borderRadius: "20px", padding: "40px", display: "flex", alignItems: "center", gap: "28px", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(29,78,216,0.2)" },
    heroGlow: { position: "absolute", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", top: "-60px", right: "-40px" },
    bigAvatar:{ width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "32px", color: "#fff", flexShrink: 0, zIndex: 1, border: "3px solid rgba(255,255,255,0.2)" },
    heroInfo: { zIndex: 1, display: "flex", flexDirection: "column", gap: "6px" },
    heroName: { fontSize: "24px", fontWeight: "800", color: "#fff", margin: 0 },
    heroEmail:{ fontSize: "14px", color: "#93c5fd", margin: 0 },
    heroBadges:{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" },
    badge:    { fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "99px" },

    // Stats grid
    statsGrid:{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
    statCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    statVal:  { fontSize: "26px", fontWeight: "900", lineHeight: 1 },
    statLbl:  { fontSize: "12px", color: "#64748b", fontWeight: "500", marginTop: "4px" },

    // Section card
    card:     { backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px 28px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "16px" },
    cardTitle:{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },

    // Topic row
    topicRow: { display: "flex", alignItems: "center", gap: "12px" },
    topicName:{ fontSize: "14px", fontWeight: "600", color: "#1e293b", width: "140px", flexShrink: 0 },
    barTrack: { flex: 1, height: "8px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    barFill:  { height: "100%", borderRadius: "99px", transition: "width 0.6s ease" },
    barPct:   { fontSize: "13px", fontWeight: "700", width: "40px", textAlign: "right" },

    // Streak section
    streakRow:{ display: "flex", gap: "16px" },
    streakCard:{ flex: 1, backgroundColor: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: "12px", padding: "20px", textAlign: "center" },
    streakVal: { fontSize: "36px", fontWeight: "900", color: "#f59e0b" },
    streakLbl: { fontSize: "12px", color: "#92400e", fontWeight: "600", marginTop: "4px" },

    // Edit form
    input:    { width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#1e293b", backgroundColor: "#f8fafc" },
    saveBtn:  { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "11px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", alignSelf: "flex-start" },
    successMsg:{ fontSize: "13px", color: "#15803d", fontWeight: "600" },
};

const TOPIC_COLORS = {
    "Java OOP": "#f59e0b", "Spring Boot": "#22c55e",
    "SQL & Databases": "#3b82f6", "React Basics": "#a855f7",
    "REST APIs": "#0ea5e9", "Security & JWT": "#ec4899",
};

function Profile() {
    const navigate  = useNavigate();
    const token     = localStorage.getItem("token") || "";
    const payload   = parseToken(token);
    const email     = payload.sub || "";
    const role      = payload.role || "USER";

    const [displayName, setDisplayName] = useState(() =>
        localStorage.getItem("profileName") || email.split("@")[0]
    );
    const [editName,  setEditName]  = useState(displayName);
    const [saved,     setSaved]     = useState(false);
    const streak = getStreak();

    // Load results from localStorage
    const allResults = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    const myResults  = allResults.filter(r => r.name === email);

    const totalAttempts = myResults.length;
    const bestScore     = myResults.length ? Math.max(...myResults.map(r => r.score)) : 0;
    const avgScore      = myResults.length ? Math.round(myResults.reduce((a, r) => a + r.score, 0) / myResults.length) : 0;
    const topicsPlayed  = [...new Set(myResults.map(r => r.topic))].length;

    // Best score per topic
    const topicBest = {};
    myResults.forEach(r => {
        if (!topicBest[r.topic] || r.score > topicBest[r.topic]) topicBest[r.topic] = r.score;
    });

    const handleSave = () => {
        localStorage.setItem("profileName", editName);
        setDisplayName(editName);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const ac = avatarColor(email);
    const initial = displayName[0]?.toUpperCase() || "U";

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>

            <main style={s.main} className="page-enter">

                {/* Profile Hero */}
                <div style={s.heroCard}>
                    <div style={s.heroGlow} />
                    <div style={{ ...s.bigAvatar, backgroundColor: ac }}>{initial}</div>
                    <div style={s.heroInfo}>
                        <h1 style={s.heroName}>{displayName}</h1>
                        <p style={s.heroEmail}>{email}</p>
                        <div style={s.heroBadges}>
                            <span style={{ ...s.badge, backgroundColor: "rgba(59,130,246,0.2)", color: "#93c5fd" }}>
                                {role}
                            </span>
                            {streak.streak > 0 && (
                                <span style={{ ...s.badge, backgroundColor: "rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                                    🔥 {streak.streak} day streak
                                </span>
                            )}
                            {bestScore >= 90 && (
                                <span style={{ ...s.badge, backgroundColor: "rgba(34,197,94,0.2)", color: "#86efac" }}>
                                    🏆 Top Scorer
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div style={s.statsGrid}>
                    {[
                        { icon: "📝", val: totalAttempts, lbl: "Total Quizzes",  color: "#3b82f6" },
                        { icon: "🏆", val: `${bestScore}%`, lbl: "Best Score",   color: "#f59e0b" },
                        { icon: "📊", val: `${avgScore}%`,  lbl: "Avg Score",    color: "#22c55e" },
                        { icon: "📚", val: topicsPlayed,    lbl: "Topics Played", color: "#a855f7" },
                    ].map(st => (
                        <div key={st.lbl} style={s.statCard}>
                            <div style={{ fontSize: "24px" }}>{st.icon}</div>
                            <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
                            <div style={s.statLbl}>{st.lbl}</div>
                        </div>
                    ))}
                </div>

                {/* Streak */}
                <div style={s.card}>
                    <p style={s.cardTitle}>🔥 Streak</p>
                    <div style={s.streakRow}>
                        <div style={s.streakCard}>
                            <div style={s.streakVal}>{streak.streak}</div>
                            <div style={s.streakLbl}>Current Streak (days)</div>
                        </div>
                        <div style={{ ...s.streakCard, backgroundColor: "#fdf4ff", borderColor: "#e9d5ff" }}>
                            <div style={{ ...s.streakVal, color: "#a855f7" }}>{streak.longest}</div>
                            <div style={{ ...s.streakLbl, color: "#6b21a8" }}>Longest Streak (days)</div>
                        </div>
                    </div>
                </div>

                {/* Topic Performance */}
                {Object.keys(topicBest).length > 0 && (
                    <div style={s.card}>
                        <p style={s.cardTitle}>📚 Performance by Topic</p>
                        {Object.entries(topicBest).map(([topic, score]) => (
                            <div key={topic} style={s.topicRow}>
                                <span style={s.topicName}>{topic}</span>
                                <div style={s.barTrack}>
                                    <div style={{ ...s.barFill, width: `${score}%`, backgroundColor: TOPIC_COLORS[topic] || "#3b82f6" }} />
                                </div>
                                <span style={{ ...s.barPct, color: TOPIC_COLORS[topic] || "#3b82f6" }}>{score}%</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Profile */}
                <div style={s.card}>
                    <p style={s.cardTitle}>✏️ Edit Profile</p>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Display Name</label>
                        <input
                            style={s.input}
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            placeholder="Enter your display name"
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Email</label>
                        <input style={{ ...s.input, color: "#94a3b8", cursor: "not-allowed" }} value={email} disabled />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <button style={s.saveBtn} onClick={handleSave}>Save Changes</button>
                        {saved && <span style={s.successMsg}>✅ Profile updated!</span>}
                    </div>
                </div>

            </main>
        </div>
    );
}

export default Profile;
