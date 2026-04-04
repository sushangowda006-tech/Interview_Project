import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MEDALS      = ["🥇", "🥈", "🥉"];
const PODIUM_CLR  = ["#f59e0b", "#94a3b8", "#b45309"];
const PODIUM_BG   = ["#fffbeb", "#f8fafc", "#fef3c7"];
const PODIUM_BORDER = ["#fde68a", "#e2e8f0", "#fcd34d"];

const AVATAR_COLORS = ["#3b82f6","#22c55e","#f59e0b","#a855f7","#ef4444","#0ea5e9","#ec4899","#14b8a6","#f97316","#6366f1"];

function getScoreColor(score) {
    if (score >= 90) return "#22c55e";
    if (score >= 75) return "#f59e0b";
    return "#ef4444";
}

function getAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const s = {
    screen:  { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:   { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:    { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "28px", maxWidth: "960px", width: "100%", margin: "0 auto", paddingBottom: "48px" },

    hero:      { background: "linear-gradient(135deg, #1e293b 0%, #92400e 100%)", borderRadius: "20px", padding: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
    heroGlow:  { position: "absolute", width: "220px", height: "220px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", top: "-60px", right: "-40px" },
    heroGlow2: { position: "absolute", width: "140px", height: "140px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)", bottom: "-40px", right: "140px" },
    heroLeft:  { display: "flex", flexDirection: "column", gap: "8px", zIndex: 1 },
    heroLabel: { fontSize: "12px", color: "#fcd34d", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", margin: 0 },
    heroTitle: { fontSize: "30px", fontWeight: "900", color: "#ffffff", margin: 0, lineHeight: 1.2 },
    heroSub:   { fontSize: "14px", color: "#d1d5db", margin: 0 },
    heroRight: { display: "flex", gap: "20px", zIndex: 1 },
    heroStat:  { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
    heroStatVal:   { fontSize: "26px", fontWeight: "900", color: "#fcd34d" },
    heroStatLabel: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },

    summaryRow:  { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    summaryCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0" },
    summaryIcon: { width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 },
    summaryVal:  { fontSize: "22px", fontWeight: "800", lineHeight: 1 },
    summaryLbl:  { fontSize: "12px", color: "#64748b", fontWeight: "500" },

    podiumGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
    podiumCard:    { borderRadius: "16px", padding: "28px 20px", textAlign: "center", border: "2px solid", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" },
    podiumMedal:   { fontSize: "40px" },
    podiumAvatar:  { width: "52px", height: "52px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "20px", color: "#fff" },
    podiumName:    { fontSize: "14px", fontWeight: "700", color: "#1e293b" },
    podiumScore:   { fontSize: "26px", fontWeight: "900", lineHeight: 1 },
    podiumTopic:   { fontSize: "11px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "3px 10px", borderRadius: "99px" },
    podiumDate:    { fontSize: "11px", color: "#94a3b8" },

    sectionLabel: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },
    table:     { backgroundColor: "#ffffff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    tableHead: { display: "grid", gridTemplateColumns: "56px 2fr 1fr 1fr 1.5fr", padding: "13px 24px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" },
    tableHCell:{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
    tableRow:  { display: "grid", gridTemplateColumns: "56px 2fr 1fr 1fr 1.5fr", padding: "14px 24px", borderBottom: "1px solid #f1f5f9", alignItems: "center", transition: "background 0.15s ease", cursor: "default" },
    rankCell:  { fontSize: "15px", fontWeight: "800" },
    nameWrap:  { display: "flex", alignItems: "center", gap: "10px" },
    avatar:    { width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "#fff", flexShrink: 0 },
    nameText:  { fontSize: "14px", fontWeight: "600", color: "#1e293b", margin: 0 },
    topicBadge:{ fontSize: "11px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "99px", marginTop: "2px", display: "inline-block" },
    scoreCell: { fontSize: "15px", fontWeight: "800" },
    attCell:   { fontSize: "13px", color: "#64748b" },
    barWrap:   { display: "flex", alignItems: "center", gap: "8px" },
    barTrack:  { flex: 1, height: "8px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    barFill:   { height: "100%", borderRadius: "99px", transition: "width 0.6s ease" },
    barPct:    { fontSize: "12px", fontWeight: "700", width: "36px", textAlign: "right" },

    // Empty state
    emptyWrap: { backgroundColor: "#ffffff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    emptyIcon: { fontSize: "64px" },
    emptyTitle:{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
    emptyDesc: { fontSize: "14px", color: "#64748b", margin: 0 },
    emptyBtn:  { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 14px rgba(59,130,246,0.3)" },
};

function Leaderboard() {
    const navigate  = useNavigate();
    const [hovered, setHovered] = useState(null);
    const [loading, setLoading] = useState(true);
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        // Simulate brief load for smooth UX
        const timer = setTimeout(() => {
            const data = JSON.parse(localStorage.getItem("leaderboard") || "[]");
            setLeaders(data);
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const isEmpty   = leaders.length === 0;
    const topScore  = isEmpty ? 0 : leaders[0].score;
    const avgScore  = isEmpty ? 0 : Math.round(leaders.reduce((a, l) => a + l.score, 0) / leaders.length);
    const total     = leaders.length;

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
            </nav>

            <main style={s.main} className="page-enter">

                {/* Loading State */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div className="skeleton" style={{ height: "140px", borderRadius: "20px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "80px" }} />)}
                        </div>
                        <div className="skeleton" style={{ height: "200px" }} />
                        <div className="skeleton" style={{ height: "300px" }} />
                    </div>
                ) : (<>

                {/* Hero Banner */}
                <div style={s.hero}>
                    <div style={s.heroGlow} />
                    <div style={s.heroGlow2} />
                    <div style={s.heroLeft}>
                        <p style={s.heroLabel}>🏆 Hall of Fame</p>
                        <h1 style={s.heroTitle}>Leaderboard</h1>
                        <p style={s.heroSub}>Top performers ranked by highest score</p>
                    </div>
                    <div style={s.heroRight}>
                        <div style={s.heroStat}>
                            <span style={s.heroStatVal}>{isEmpty ? "—" : `${topScore}%`}</span>
                            <span style={s.heroStatLabel}>Top Score</span>
                        </div>
                        <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
                        <div style={s.heroStat}>
                            <span style={s.heroStatVal}>{isEmpty ? "—" : `${avgScore}%`}</span>
                            <span style={s.heroStatLabel}>Avg Score</span>
                        </div>
                        <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
                        <div style={s.heroStat}>
                            <span style={s.heroStatVal}>{total}</span>
                            <span style={s.heroStatLabel}>Players</span>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {isEmpty ? (
                    <div style={s.emptyWrap}>
                        <span style={s.emptyIcon}>🏆</span>
                        <h2 style={s.emptyTitle}>No results yet!</h2>
                        <p style={s.emptyDesc}>Be the first to complete a quiz and claim the top spot.</p>
                        <button style={s.emptyBtn} onClick={() => navigate("/quiz")}>
                            🧠 Take a Quiz Now
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div style={s.summaryRow} className="summary-row">
                            {[
                                { icon: "🥇", iconBg: "#fef3c7", val: `${topScore}%`, label: "Highest Score", color: "#f59e0b" },
                                { icon: "📊", iconBg: "#eff6ff", val: `${avgScore}%`, label: "Average Score", color: "#3b82f6" },
                                { icon: "👥", iconBg: "#f0fdf4", val: `${total}`,      label: "Total Players", color: "#22c55e" },
                            ].map((stat) => (
                                <div key={stat.label} style={s.summaryCard}>
                                    <div style={{ ...s.summaryIcon, backgroundColor: stat.iconBg }}>{stat.icon}</div>
                                    <div>
                                        <p style={{ ...s.summaryVal, color: stat.color, margin: 0 }}>{stat.val}</p>
                                        <p style={{ ...s.summaryLbl, margin: 0 }}>{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Top 3 Podium */}
                        {leaders.length >= 3 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                <p style={s.sectionLabel}>🎖️ Top 3 Podium</p>
                                <div style={s.podiumGrid} className="podium-grid">
                                    {leaders.slice(0, 3).map((l, i) => (
                                        <div key={l.name + i} className="card-enter" style={{
                                            ...s.podiumCard,
                                            backgroundColor: PODIUM_BG[i],
                                            borderColor: PODIUM_BORDER[i],
                                            transform: i === 0 ? "translateY(-6px)" : "none",
                                            boxShadow: i === 0 ? "0 8px 28px rgba(245,158,11,0.2)" : "0 1px 4px rgba(0,0,0,0.07)",
                                        }}>
                                            <span style={s.podiumMedal}>{MEDALS[i]}</span>
                                            <div style={{ ...s.podiumAvatar, backgroundColor: getAvatarColor(l.name) }}>
                                                {l.name[0].toUpperCase()}
                                            </div>
                                            <span style={s.podiumName}>{l.name.split("@")[0]}</span>
                                            <span style={{ ...s.podiumScore, color: PODIUM_CLR[i] }}>{l.score}%</span>
                                            <span style={s.podiumTopic}>{l.topic}</span>
                                            <span style={s.podiumDate}>{l.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Full Rankings Table */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <p style={s.sectionLabel}>📋 Full Rankings</p>
                            <div style={s.table}>
                                <div style={s.tableHead}>
                                    <span style={s.tableHCell}>Rank</span>
                                    <span style={s.tableHCell}>Player</span>
                                    <span style={s.tableHCell}>Score</span>
                                    <span style={s.tableHCell}>Date</span>
                                    <span style={s.tableHCell}>Performance</span>
                                </div>
                                {leaders.map((l, i) => {
                                    const scoreColor = getScoreColor(l.score);
                                    const avatarColor = getAvatarColor(l.name);
                                    return (
                                        <div
                                            key={l.name + i}
                                            style={{
                                                ...s.tableRow,
                                                backgroundColor: hovered === i ? "#f8fafc" : i < 3 ? PODIUM_BG[i] : "#ffffff",
                                            }}
                                            onMouseEnter={() => setHovered(i)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <span style={{ ...s.rankCell, color: i < 3 ? PODIUM_CLR[i] : "#94a3b8" }}>
                                                {i < 3 ? MEDALS[i] : `#${i + 1}`}
                                            </span>
                                            <div style={s.nameWrap}>
                                                <div style={{ ...s.avatar, backgroundColor: avatarColor }}>
                                                    {l.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={s.nameText}>{l.name.split("@")[0]}</p>
                                                    <span style={s.topicBadge}>{l.topic}</span>
                                                </div>
                                            </div>
                                            <span style={{ ...s.scoreCell, color: scoreColor }}>{l.score}%</span>
                                            <span style={s.attCell}>{l.date}</span>
                                            <div style={s.barWrap}>
                                                <div style={s.barTrack}>
                                                    <div style={{ ...s.barFill, width: `${l.score}%`, backgroundColor: scoreColor }} />
                                                </div>
                                                <span style={{ ...s.barPct, color: scoreColor }}>{l.score}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

            </>
                ) }
            </main>
        </div>
    );
}

export default Leaderboard;
