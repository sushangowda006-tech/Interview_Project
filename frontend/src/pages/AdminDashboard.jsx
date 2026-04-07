import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function parseToken(token) {
    try { return JSON.parse(atob(token.split(".")[1])); } catch { return {}; }
}

const s = {
    screen:  { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },

    // Navbar
    navbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:   { display: "flex", alignItems: "center", gap: "10px", color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    brandDot:{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#a855f7", display: "inline-block" },
    adminBadge: { backgroundColor: "rgba(168,85,247,0.2)", color: "#c084fc", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px", letterSpacing: "0.5px" },
    navRight:{ display: "flex", alignItems: "center", gap: "14px" },
    avatar:  { width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" },
    userInfo:{ display: "flex", flexDirection: "column", alignItems: "flex-end" },
    userEmail:{ color: "#f1f5f9", fontSize: "13px", fontWeight: "600" },
    userRole: { color: "#a855f7", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
    divider: { width: "1px", height: "32px", backgroundColor: "#334155" },
    logoutBtn:{ backgroundColor: "transparent", color: "#f87171", border: "1.5px solid #f87171", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },

    // Layout
    body:    { display: "flex", flex: 1 },
    sidebar: { width: "220px", backgroundColor: "#1e293b", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 },
    sideItem:{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 24px", color: "#94a3b8", fontSize: "14px", cursor: "pointer", borderLeft: "3px solid transparent", transition: "all 0.2s" },
    sideItemActive: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 24px", color: "#f8fafc", fontSize: "14px", cursor: "pointer", backgroundColor: "#0f172a", borderLeft: "3px solid #a855f7", fontWeight: "600" },
    main:    { flex: 1, padding: "32px", display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" },

    // Cards
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" },
    statCard:  { backgroundColor: "#fff", borderRadius: "14px", padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    statIcon:  { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 },
    statVal:   { fontSize: "26px", fontWeight: "800", lineHeight: 1 },
    statLbl:   { fontSize: "12px", color: "#64748b", fontWeight: "500", marginTop: "2px" },

    // Hero banner
    hero: { background: "linear-gradient(135deg, #1e293b 0%, #4c1d95 100%)", borderRadius: "16px", padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(124,58,237,0.2)" },
    heroGlow: { position: "absolute", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", top: "-60px", right: "-40px" },
    heroTitle:{ fontSize: "26px", fontWeight: "900", color: "#fff", margin: "0 0 6px" },
    heroSub:  { fontSize: "14px", color: "#c4b5fd", margin: 0 },

    // Section
    sectionTitle: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },

    // Table
    tableWrap: { backgroundColor: "#fff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    tableHead: { display: "grid", gridTemplateColumns: "40px 1.5fr 2fr 80px 100px 100px", padding: "12px 20px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" },
    tableHCell:{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    tableRow:  { display: "grid", gridTemplateColumns: "40px 1.5fr 2fr 80px 100px 100px", padding: "14px 20px", borderBottom: "1px solid #f1f5f9", alignItems: "center", cursor: "pointer", transition: "background 0.15s" },
    nameWrap:  { display: "flex", alignItems: "center", gap: "10px" },
    uAvatar:   { width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "#fff", flexShrink: 0 },
    uName:     { fontSize: "14px", fontWeight: "600", color: "#1e293b" },
    uEmail:    { fontSize: "12px", color: "#94a3b8" },
    badge:     { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px", display: "inline-block" },
    viewBtn:   { backgroundColor: "#f3e8ff", color: "#7c3aed", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },

    // Results panel
    panel:     { backgroundColor: "#fff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    panelHead: { padding: "16px 24px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    panelTitle:{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },
    closeBtn:  { backgroundColor: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "#94a3b8", lineHeight: 1 },
    resHead:   { display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr 1.5fr", padding: "11px 24px", backgroundColor: "#faf5ff", borderBottom: "1px solid #e2e8f0" },
    resRow:    { display: "grid", gridTemplateColumns: "50px 1fr 1fr 1fr 1.5fr", padding: "13px 24px", borderBottom: "1px solid #f1f5f9", alignItems: "center" },
    barTrack:  { flex: 1, height: "8px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    barFill:   { height: "100%", borderRadius: "99px" },

    emptyBox:  { padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "14px" },
    spinner:   { display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", fontSize: "14px", color: "#94a3b8" },
};

const AVATAR_COLORS = ["#3b82f6","#22c55e","#f59e0b","#a855f7","#ef4444","#0ea5e9","#ec4899","#14b8a6"];
function avatarColor(name) {
    let h = 0;
    for (let i = 0; i < (name||"").length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function scoreColor(p) { return p >= 75 ? "#22c55e" : p >= 50 ? "#f59e0b" : "#ef4444"; }
function scoreBg(p)    { return p >= 75 ? "#dcfce7" : p >= 50 ? "#fef3c7" : "#fee2e2"; }
function scoreLabel(p) { return p >= 75 ? "Pass" : "Fail"; }

const TABS = [
    { icon: "🏠", label: "Overview" },
    { icon: "👥", label: "Users & Results" },
    { icon: "📝", label: "Questions" },
];

function AdminDashboard() {
    const navigate = useNavigate();
    const token    = localStorage.getItem("token") || "";
    const { sub: email } = parseToken(token);
    const initial  = email ? email[0].toUpperCase() : "A";

    const [tab,        setTab]        = useState(0);
    const [users,      setUsers]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState("");
    const [selected,   setSelected]   = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);

    // Feature 10: Questions state
    const [questions,  setQuestions]  = useState([]);
    const [qLoading,   setQLoading]   = useState(false);
    const [editQ,      setEditQ]      = useState(null); // question being edited
    const [showForm,   setShowForm]   = useState(false);
    const EMPTY_Q = { topic: "", questionTitle: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" };
    const [qForm,      setQForm]      = useState(EMPTY_Q);
    const [qMsg,       setQMsg]       = useState("");

    useEffect(() => {
        API.get("/admin/users-with-results")
            .then(res => { setUsers(res.data); setLoading(false); })
            .catch(() => { setError("Failed to load data."); setLoading(false); });
    }, []);

    // Load questions when tab 2 selected
    useEffect(() => {
        if (tab === 2) {
            setQLoading(true);
            API.get("/admin/questions")
                .then(res => { setQuestions(res.data); setQLoading(false); })
                .catch(() => setQLoading(false));
        }
    }, [tab]);

    const handleQSave = async () => {
        try {
            if (editQ) {
                await API.put(`/admin/questions/${editQ.id}`, qForm);
                setQMsg("✅ Question updated!");
            } else {
                await API.post("/admin/questions", qForm);
                setQMsg("✅ Question added!");
            }
            setShowForm(false); setEditQ(null); setQForm(EMPTY_Q);
            const res = await API.get("/admin/questions");
            setQuestions(res.data);
        } catch { setQMsg("❌ Failed to save."); }
        setTimeout(() => setQMsg(""), 3000);
    };

    const handleQDelete = async (id) => {
        if (!window.confirm("Delete this question?")) return;
        await API.delete(`/admin/questions/${id}`);
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const openEdit = (q) => {
        setEditQ(q);
        setQForm({ topic: q.topic || "", questionTitle: q.questionTitle, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer });
        setShowForm(true);
    };

    const handleLogout = () => { localStorage.removeItem("token"); navigate("/", { replace: true }); };

    // Derived stats
    const totalUsers   = users.length;
    const totalResults = users.reduce((a, u) => a + (u.results?.length || 0), 0);
    const allPcts      = users.flatMap(u => u.results?.map(r => r.percentage) || []);
    const avgScore     = allPcts.length ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length) : 0;
    const topScore     = allPcts.length ? Math.round(Math.max(...allPcts)) : 0;

    const STATS = [
        { icon: "👥", iconBg: "#eff6ff", val: totalUsers,   lbl: "Total Users",    color: "#3b82f6" },
        { icon: "📝", iconBg: "#f0fdf4", val: totalResults, lbl: "Total Attempts", color: "#22c55e" },
        { icon: "📊", iconBg: "#fdf4ff", val: `${avgScore}%`, lbl: "Avg Score",    color: "#a855f7" },
        { icon: "🏆", iconBg: "#fffbeb", val: `${topScore}%`, lbl: "Top Score",    color: "#f59e0b" },
    ];

    return (
        <div style={s.screen}>

            {/* Navbar */}
            <nav style={s.navbar}>
                <div style={s.brand}>
                    <span style={s.brandDot} />
                    Interview System
                    <span style={s.adminBadge}>ADMIN</span>
                </div>
                <div style={s.navRight}>
                    <div style={s.avatar}>{initial}</div>
                    <div style={s.userInfo}>
                        <span style={s.userEmail}>{email || "Admin"}</span>
                        <span style={s.userRole}>Administrator</span>
                    </div>
                    <div style={s.divider} />
                    <button style={s.logoutBtn} onClick={handleLogout}>⏻ Logout</button>
                </div>
            </nav>

            <div style={s.body}>

                {/* Sidebar */}
                <aside style={s.sidebar}>
                    {TABS.map((t, i) => (
                        <div key={t.label}
                            style={tab === i ? s.sideItemActive : s.sideItem}
                            onClick={() => { setTab(i); setSelected(null); }}
                        >
                            <span>{t.icon}</span><span>{t.label}</span>
                        </div>
                    ))}
                </aside>

                {/* Main */}
                <main style={s.main} className="page-enter">

                    {/* ── OVERVIEW TAB ── */}
                    {tab === 0 && (<>

                        {/* Hero */}
                        <div style={s.hero}>
                            <div style={s.heroGlow} />
                            <div style={{ zIndex: 1 }}>
                                <h2 style={s.heroTitle}>Admin Dashboard 🛠️</h2>
                                <p style={s.heroSub}>Monitor users, quiz attempts and performance results</p>
                            </div>
                            <div style={{ zIndex: 1, fontSize: "56px" }}>📊</div>
                        </div>

                        {/* Stats */}
                        <div style={s.statsGrid}>
                            {STATS.map(st => (
                                <div key={st.lbl} style={s.statCard}>
                                    <div style={{ ...s.statIcon, backgroundColor: st.iconBg }}>{st.icon}</div>
                                    <div>
                                        <div style={{ ...s.statVal, color: st.color }}>{st.val}</div>
                                        <div style={s.statLbl}>{st.lbl}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent results summary */}
                        <p style={s.sectionTitle}>🕒 Recent Quiz Attempts</p>
                        <div style={s.tableWrap}>
                            <div style={{ ...s.tableHead, gridTemplateColumns: "40px 1.5fr 2fr 1fr 1fr" }}>
                                {["#", "User", "Email", "Score", "Result"].map(h => (
                                    <span key={h} style={s.tableHCell}>{h}</span>
                                ))}
                            </div>
                            {loading ? (
                                <div style={s.spinner}>Loading...</div>
                            ) : users.flatMap(u => (u.results || []).map(r => ({ ...r, userName: u.name, userEmail: u.email }))).length === 0 ? (
                                <div style={s.emptyBox}>No quiz attempts yet.</div>
                            ) : (
                                users.flatMap(u => (u.results || []).map(r => ({ ...r, userName: u.name, userEmail: u.email })))
                                    .sort((a, b) => b.id - a.id)
                                    .slice(0, 10)
                                    .map((r, i) => (
                                        <div key={r.id} style={{ ...s.tableRow, gridTemplateColumns: "40px 1.5fr 2fr 1fr 1fr", backgroundColor: hoveredRow === `ov${i}` ? "#f8fafc" : "#fff" }}
                                            onMouseEnter={() => setHoveredRow(`ov${i}`)}
                                            onMouseLeave={() => setHoveredRow(null)}>
                                            <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{i + 1}</span>
                                            <div style={s.nameWrap}>
                                                <div style={{ ...s.uAvatar, backgroundColor: avatarColor(r.userName), width: "28px", height: "28px", fontSize: "12px" }}>
                                                    {(r.userName || "?")[0].toUpperCase()}
                                                </div>
                                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>{r.userName}</span>
                                            </div>
                                            <span style={{ fontSize: "12px", color: "#64748b" }}>{r.userEmail}</span>
                                            <span style={{ fontSize: "14px", fontWeight: "800", color: scoreColor(r.percentage) }}>{Math.round(r.percentage)}%</span>
                                            <span style={{ ...s.badge, backgroundColor: scoreBg(r.percentage), color: scoreColor(r.percentage) }}>{scoreLabel(r.percentage)}</span>
                                        </div>
                                    ))
                            )}
                        </div>
                    </>)}

                    {/* ── USERS & RESULTS TAB ── */}
                    {tab === 1 && (<>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", margin: "0 0 4px" }}>👥 Users & Results</h2>
                                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Click "View Results" to see a user's full quiz history</p>
                            </div>
                            <span style={{ fontSize: "13px", color: "#64748b" }}>{totalUsers} user{totalUsers !== 1 ? "s" : ""} registered</span>
                        </div>

                        {error && <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 16px", borderRadius: "10px", fontSize: "13px" }}>{error}</div>}

                        {/* Users table */}
                        <div style={s.tableWrap}>
                            <div style={s.tableHead}>
                                {["#", "Name", "Email", "Role", "Attempts", "Action"].map(h => (
                                    <span key={h} style={s.tableHCell}>{h}</span>
                                ))}
                            </div>
                            {loading ? (
                                <div style={s.spinner}>Loading users...</div>
                            ) : users.length === 0 ? (
                                <div style={s.emptyBox}>No users registered yet.</div>
                            ) : (
                                users.map((u, i) => (
                                    <div key={u.id}
                                        style={{ ...s.tableRow, backgroundColor: hoveredRow === i ? "#f8fafc" : "#fff" }}
                                        onMouseEnter={() => setHoveredRow(i)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{i + 1}</span>
                                        <div style={s.nameWrap}>
                                            <div style={{ ...s.uAvatar, backgroundColor: avatarColor(u.name) }}>
                                                {(u.name || "?")[0].toUpperCase()}
                                            </div>
                                            <span style={s.uName}>{u.name}</span>
                                        </div>
                                        <span style={s.uEmail}>{u.email}</span>
                                        <span style={{ ...s.badge, backgroundColor: "#f0fdf4", color: "#15803d" }}>{u.role}</span>
                                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                                            {u.results?.length || 0} attempt{(u.results?.length || 0) !== 1 ? "s" : ""}
                                        </span>
                                        <button style={s.viewBtn} onClick={() => setSelected(u)}>
                                            View Results →
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Results panel for selected user */}
                        {selected && (
                            <div style={s.panel}>
                                <div style={s.panelHead}>
                                    <div>
                                        <p style={s.panelTitle}>
                                            📋 Results for {selected.name}
                                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "400", marginLeft: "8px" }}>{selected.email}</span>
                                        </p>
                                    </div>
                                    <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
                                </div>

                                {/* Results header */}
                                <div style={s.resHead}>
                                    {["#", "Score", "Total Qs", "Percentage", "Performance"].map(h => (
                                        <span key={h} style={{ ...s.tableHCell }}>{h}</span>
                                    ))}
                                </div>

                                {(!selected.results || selected.results.length === 0) ? (
                                    <div style={s.emptyBox}>This user hasn't taken any quiz yet.</div>
                                ) : (
                                    selected.results.map((r, i) => {
                                        const pct = Math.round(r.percentage);
                                        const sc  = scoreColor(pct);
                                        return (
                                            <div key={r.id} style={{ ...s.resRow, backgroundColor: i % 2 === 0 ? "#fff" : "#faf5ff" }}>
                                                <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{i + 1}</span>
                                                <span style={{ fontSize: "15px", fontWeight: "800", color: sc }}>{r.score}</span>
                                                <span style={{ fontSize: "13px", color: "#64748b" }}>{r.totalQuestions}</span>
                                                <span style={{ ...s.badge, backgroundColor: scoreBg(pct), color: sc }}>{pct}% — {scoreLabel(pct)}</span>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <div style={s.barTrack}>
                                                        <div style={{ ...s.barFill, width: `${pct}%`, backgroundColor: sc }} />
                                                    </div>
                                                    <span style={{ fontSize: "12px", fontWeight: "700", color: sc, width: "36px" }}>{pct}%</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {/* Summary row */}
                                {selected.results?.length > 0 && (() => {
                                    const pcts = selected.results.map(r => r.percentage);
                                    const avg  = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
                                    const best = Math.round(Math.max(...pcts));
                                    return (
                                        <div style={{ display: "flex", gap: "24px", padding: "16px 24px", backgroundColor: "#f8fafc", borderTop: "1.5px solid #e2e8f0" }}>
                                            <span style={{ fontSize: "13px", color: "#64748b" }}>
                                                Total attempts: <strong style={{ color: "#1e293b" }}>{selected.results.length}</strong>
                                            </span>
                                            <span style={{ fontSize: "13px", color: "#64748b" }}>
                                                Average score: <strong style={{ color: scoreColor(avg) }}>{avg}%</strong>
                                            </span>
                                            <span style={{ fontSize: "13px", color: "#64748b" }}>
                                                Best score: <strong style={{ color: scoreColor(best) }}>{best}%</strong>
                                            </span>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </>)}

                    {/* ── QUESTIONS TAB ── */}
                    {tab === 2 && (<>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#1e293b", margin: "0 0 4px" }}>📝 Manage Questions</h2>
                                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{questions.length} questions in database</p>
                            </div>
                            <button onClick={() => { setEditQ(null); setQForm(EMPTY_Q); setShowForm(true); }}
                                style={{ backgroundColor: "#7c3aed", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                                + Add Question
                            </button>
                        </div>

                        {qMsg && <div style={{ backgroundColor: qMsg.startsWith("✅") ? "#f0fdf4" : "#fef2f2", border: `1px solid ${qMsg.startsWith("✅") ? "#bbf7d0" : "#fecaca"}`, color: qMsg.startsWith("✅") ? "#15803d" : "#b91c1c", padding: "12px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600" }}>{qMsg}</div>}

                        {/* Add/Edit Form */}
                        {showForm && (
                            <div style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "24px", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: 0 }}>{editQ ? "✏️ Edit Question" : "+ New Question"}</h3>
                                {[["topic", "Topic (e.g. Java OOP)"], ["questionTitle", "Question"], ["optionA", "Option A"], ["optionB", "Option B"], ["optionC", "Option C"], ["optionD", "Option D"]].map(([key, label]) => (
                                    <div key={key}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>{label}</label>
                                        <input value={qForm[key]} onChange={e => setQForm(f => ({ ...f, [key]: e.target.value }))}
                                            style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>Correct Answer</label>
                                    <select value={qForm.correctAnswer} onChange={e => setQForm(f => ({ ...f, correctAnswer: e.target.value }))}
                                        style={{ padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                                        {["A","B","C","D"].map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={handleQSave} style={{ backgroundColor: "#7c3aed", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>Save</button>
                                    <button onClick={() => { setShowForm(false); setEditQ(null); }} style={{ backgroundColor: "#f1f5f9", color: "#64748b", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* Questions Table */}
                        <div style={s.tableWrap}>
                            <div style={{ ...s.tableHead, gridTemplateColumns: "50px 1fr 1.5fr 80px 100px" }}>
                                {["#", "Topic", "Question", "Answer", "Actions"].map(h => <span key={h} style={s.tableHCell}>{h}</span>)}
                            </div>
                            {qLoading ? <div style={s.spinner}>Loading...</div>
                            : questions.length === 0 ? <div style={s.emptyBox}>No questions yet. Add one above.</div>
                            : questions.map((q, i) => (
                                <div key={q.id} style={{ ...s.tableRow, gridTemplateColumns: "50px 1fr 1.5fr 80px 100px", backgroundColor: hoveredRow === `q${i}` ? "#f8fafc" : "#fff" }}
                                    onMouseEnter={() => setHoveredRow(`q${i}`)} onMouseLeave={() => setHoveredRow(null)}>
                                    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{i + 1}</span>
                                    <span style={{ ...s.badge, backgroundColor: "#f3e8ff", color: "#7c3aed" }}>{q.topic || "—"}</span>
                                    <span style={{ fontSize: "13px", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.questionTitle}</span>
                                    <span style={{ ...s.badge, backgroundColor: "#dcfce7", color: "#15803d" }}>{q.correctAnswer}</span>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        <button onClick={() => openEdit(q)} style={{ backgroundColor: "#eff6ff", color: "#3b82f6", border: "none", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>✏️</button>
                                        <button onClick={() => handleQDelete(q.id)} style={{ backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>)}

                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
