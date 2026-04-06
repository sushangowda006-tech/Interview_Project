import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateStreak, getStreak } from "../utils/streak";

// Decode JWT payload without any library
function parseToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { email: payload.sub || "", role: payload.role || "USER" };
    } catch {
        return { email: "", role: "USER" };
    }
}

const styles = {
    // Full screen wrapper
    screen: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "'Segoe UI', sans-serif",
    },

    // ── Navbar ──
    navbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1e293b",
        padding: "0 32px",
        height: "68px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    navBrand: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#f8fafc",
        fontSize: "20px",
        fontWeight: "700",
        letterSpacing: "0.4px",
        textDecoration: "none",
    },
    brandDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#3b82f6",
        display: "inline-block",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    // divider line
    navDivider: {
        width: "1px",
        height: "32px",
        backgroundColor: "#334155",
    },
    // avatar circle
    avatar: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: "#3b82f6",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "15px",
        flexShrink: 0,
    },
    userInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    userEmail: {
        color: "#f1f5f9",
        fontSize: "13px",
        fontWeight: "600",
        lineHeight: 1.3,
    },
    userRole: {
        color: "#64748b",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
    },
    logoutBtn: {
        backgroundColor: "transparent",
        color: "#f87171",
        border: "1.5px solid #f87171",
        padding: "7px 16px",
        borderRadius: "6px",
        fontWeight: "600",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s",
    },

    // Body: sidebar + main
    body: {
        display: "flex",
        flex: 1,
    },

    // Sidebar
    sidebar: {
        width: "220px",
        backgroundColor: "#1e293b",
        paddingTop: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    sidebarItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 24px",
        color: "#94a3b8",
        fontSize: "15px",
        cursor: "pointer",
        borderLeft: "3px solid transparent",
        transition: "all 0.2s",
    },
    sidebarItemActive: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 24px",
        color: "#f8fafc",
        fontSize: "15px",
        cursor: "pointer",
        backgroundColor: "#0f172a",
        borderLeft: "3px solid #3b82f6",
        fontWeight: "600",
    },

    // Main content area
    main: {
        flex: 1,
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },

    // Page heading
    pageTitle: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    pageSubtitle: {
        fontSize: "14px",
        color: "#64748b",
        marginTop: "4px",
    },

    // ── Welcome Section ──
    welcomeSection: {
        background: "linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)",
        borderRadius: "16px",
        padding: "40px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(29,78,216,0.25)",
        position: "relative",
        overflow: "hidden",
    },
    welcomeGlow: {
        position: "absolute",
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.05)",
        top: "-60px",
        right: "-40px",
    },
    welcomeGlow2: {
        position: "absolute",
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.04)",
        bottom: "-40px",
        right: "120px",
    },
    welcomeLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1,
    },
    welcomeGreeting: {
        fontSize: "13px",
        color: "#93c5fd",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
        margin: 0,
    },
    welcomeName: {
        fontSize: "30px",
        fontWeight: "800",
        color: "#ffffff",
        margin: 0,
        lineHeight: 1.2,
    },
    welcomeDesc: {
        fontSize: "15px",
        color: "#cbd5e1",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    welcomeBtn: {
        backgroundColor: "#ffffff",
        color: "#1d4ed8",
        border: "none",
        padding: "11px 24px",
        borderRadius: "8px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        zIndex: 1,
        whiteSpace: "nowrap",
    },
    welcomeBadge: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        padding: "6px 16px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
    },

    // ── Action Cards ──
    cardsSection: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    cardsSectionTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        border: "1.5px solid #e2e8f0",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        position: "relative",
        overflow: "hidden",
    },
    cardIconWrap: {
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
    },
    cardTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    cardDesc: {
        fontSize: "13px",
        color: "#64748b",
        margin: 0,
        lineHeight: 1.5,
    },
    cardArrow: {
        fontSize: "18px",
        marginTop: "auto",
        color: "#94a3b8",
    },

    // ── Quick Stats ──
    statsSection: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    statsSectionTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
    },
    statCard: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: "18px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        border: "1.5px solid #e2e8f0",
        cursor: "default",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
    },
    statIconWrap: {
        width: "52px",
        height: "52px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        flexShrink: 0,
    },
    statInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    statValue: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#1e293b",
        lineHeight: 1.1,
    },
    statLabel: {
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "500",
    },
    statTrend: {
        fontSize: "12px",
        fontWeight: "600",
        marginTop: "4px",
    },
    progressBarWrap: {
        height: "6px",
        backgroundColor: "#e2e8f0",
        borderRadius: "99px",
        marginTop: "6px",
        overflow: "hidden",
        width: "100%",
    },
    progressBar: {
        height: "100%",
        borderRadius: "99px",
        transition: "width 0.6s ease",
    },

    // ── Recent Activity ──
    activitySection: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        paddingBottom: "32px",
    },
    activityHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    activityTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    activityViewAll: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#3b82f6",
        cursor: "pointer",
        textDecoration: "none",
        border: "none",
        background: "none",
        padding: 0,
    },
    activityCard: {
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        border: "1.5px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    },
    activityRow: {
        display: "flex",
        alignItems: "center",
        padding: "16px 24px",
        gap: "16px",
        transition: "background 0.15s ease",
        cursor: "default",
    },
    activityRowDivider: {
        height: "1px",
        backgroundColor: "#f1f5f9",
        margin: "0 24px",
    },
    activityIconWrap: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        flexShrink: 0,
    },
    activityInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        flex: 1,
    },
    activityTopic: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#1e293b",
    },
    activityDate: {
        fontSize: "12px",
        color: "#94a3b8",
    },
    activityRight: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "4px",
    },
    activityScore: {
        fontSize: "18px",
        fontWeight: "800",
    },
    activityBadge: {
        fontSize: "11px",
        fontWeight: "600",
        padding: "2px 10px",
        borderRadius: "99px",
    },
};

const NAV_ITEMS = [
    { icon: "🏠", label: "Dashboard", active: true },
    { icon: "📋", label: "My Tests" },
    { icon: "📊", label: "Results" },
    { icon: "👤", label: "Profile" },
];

const ACTION_CARDS = [
    {
        icon: "🧠",
        title: "Start Quiz",
        desc: "Pick a topic and difficulty, then test your skills.",
        color: "#eff6ff", iconBg: "#dbeafe", accent: "#3b82f6", path: "/quiz",
    },
    {
        icon: "📊",
        title: "My Results",
        desc: "Review your past scores and track your progress.",
        color: "#f0fdf4", iconBg: "#dcfce7", accent: "#22c55e", path: "/results",
    },
    {
        icon: "🏆",
        title: "Leaderboard",
        desc: "See how you rank against other candidates.",
        color: "#fffbeb", iconBg: "#fef3c7", accent: "#f59e0b", path: "/leaderboard",
    },
    {
        icon: "📈",
        title: "Score History",
        desc: "View your score trend chart and topic breakdown.",
        color: "#eff6ff", iconBg: "#dbeafe", accent: "#0ea5e9", path: "/score-history",
    },
    {
        icon: "👤",
        title: "Profile",
        desc: "Update your info, view streak and topic performance.",
        color: "#fdf4ff", iconBg: "#f3e8ff", accent: "#a855f7", path: "/profile",
    },
];

const STATS = [
    {
        icon: "🎯",
        iconBg: "#eff6ff",
        value: "12",
        label: "Total Attempts",
        trend: "+3 this week",
        trendColor: "#22c55e",
        accent: "#3b82f6",
        progress: 60,
    },
    {
        icon: "🏆",
        iconBg: "#fffbeb",
        value: "92%",
        label: "Best Score",
        trend: "Personal best!",
        trendColor: "#f59e0b",
        accent: "#f59e0b",
        progress: 92,
    },
    {
        icon: "📈",
        iconBg: "#f0fdf4",
        value: "74%",
        label: "Average Score",
        trend: "+5% vs last month",
        trendColor: "#22c55e",
        accent: "#22c55e",
        progress: 74,
    },
];

const RECENT_ACTIVITY = [
    {
        icon: "🧠",
        iconBg: "#eff6ff",
        topic: "Java OOP Concepts",
        date: "Today, 10:30 AM",
        score: 88,
    },
    {
        icon: "⚙️",
        iconBg: "#f0fdf4",
        topic: "Spring Boot Basics",
        date: "Yesterday, 3:15 PM",
        score: 74,
    },
    {
        icon: "🗄️",
        iconBg: "#fffbeb",
        topic: "SQL & Database Design",
        date: "Dec 18, 2024",
        score: 92,
    },
];

function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";
    const { email, role } = parseToken(token);
    const initial = email ? email[0].toUpperCase() : "U";
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);
    const [hoveredRow,  setHoveredRow]  = useState(null);
    const [streak,      setStreak]      = useState({ streak: 0, longest: 0 });

    useEffect(() => {
        setStreak(updateStreak());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <div style={styles.screen}>

            {/* ── Navbar ── */}
            <nav style={styles.navbar}>

                {/* Left: Brand */}
                <div style={styles.navBrand}>
                    <span style={styles.brandDot} />
                    Interview System
                </div>

                {/* Right: avatar + user info + divider + logout */}
                <div style={styles.navRight}>

                    {/* Avatar */}
                    <div style={styles.avatar}>{initial}</div>

                    {/* Email + Role */}
                    <div style={styles.userInfo}>
                        <span style={styles.userEmail}>{email || "User"}</span>
                        <span style={styles.userRole}>{role}</span>
                    </div>

                    <div style={styles.navDivider} />

                    {/* Logout */}
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        ⏻ Logout
                    </button>
                </div>
            </nav>

            {/* ── Body ── */}
            <div style={styles.body} className="dash-body">

                {/* ── Sidebar ── */}
                <aside style={styles.sidebar} className="dash-sidebar">
                    {NAV_ITEMS.map((item) => (
                        <div
                            key={item.label}
                            style={item.active ? styles.sidebarItemActive : styles.sidebarItem}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </aside>

                {/* ── Main Content ── */}
                <main style={styles.main} className="page-enter dash-main">

                    {/* Page heading */}
                    <div>
                        <h1 style={styles.pageTitle}>Dashboard</h1>
                        <p style={styles.pageSubtitle}>Here's what's happening today</p>
                    </div>

                    {/* ── Welcome Section ── */}
                    <div style={styles.welcomeSection} className="welcome-section">

                        {/* decorative glows */}
                        <div style={styles.welcomeGlow} />
                        <div style={styles.welcomeGlow2} />

                        {/* Left text */}
                        <div style={styles.welcomeLeft}>
                            <p style={styles.welcomeGreeting}>👋 Good to see you</p>
                            <h2 style={styles.welcomeName}>
                                Welcome, {email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)}!
                            </h2>
                            <p style={styles.welcomeDesc}>
                                <span>🎯</span>
                                Ready to test your knowledge? Let's get started.
                            </p>
                            {/* Streak badge */}
                            {streak.streak > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                    <span style={{ backgroundColor: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", color: "#fbbf24", padding: "4px 12px", borderRadius: "99px", fontSize: "13px", fontWeight: "700", zIndex: 1 }}>
                                        🔥 {streak.streak} day streak!
                                    </span>
                                    {streak.streak >= 7 && (
                                        <span style={{ backgroundColor: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", color: "#c084fc", padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", zIndex: 1 }}>
                                            🏆 Week Warrior!
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right CTA button */}
                        <button style={styles.welcomeBtn}>
                            Start Practice →
                        </button>

                    </div>

                    {/* ── Action Cards ── */}
                    <div style={styles.cardsSection}>
                        <p style={styles.cardsSectionTitle}>What would you like to do?</p>
                        <div style={styles.cardsGrid} className="cards-grid">
                            {ACTION_CARDS.map((card, i) => (
                                <div
                                    key={card.title}
                                    className="card-enter"
                                    style={{
                                        ...styles.card,
                                        backgroundColor: card.color,
                                        borderColor: hoveredCard === i ? card.accent : "#e2e8f0",
                                        transform: hoveredCard === i ? "translateY(-6px) scale(1.02)" : "none",
                                        boxShadow: hoveredCard === i
                                            ? `0 12px 28px rgba(0,0,0,0.12)`
                                            : "0 1px 4px rgba(0,0,0,0.07)",
                                    }}
                                    onClick={() => navigate(card.path)}
                                    onMouseEnter={() => setHoveredCard(i)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Icon */}
                                    <div style={{ ...styles.cardIconWrap, backgroundColor: card.iconBg }}>
                                        {card.icon}
                                    </div>

                                    {/* Title */}
                                    <p style={{ ...styles.cardTitle, color: card.accent }}>{card.title}</p>

                                    {/* Description */}
                                    <p style={styles.cardDesc}>{card.desc}</p>

                                    {/* Arrow */}
                                    <span style={{ ...styles.cardArrow, color: card.accent }}>→</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Quick Stats ── */}
                    <div style={styles.statsSection}>
                        <p style={styles.statsSectionTitle}>📊 Quick Stats</p>
                        <div style={styles.statsGrid} className="stats-grid">
                            {STATS.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className="card-enter"
                                    style={{
                                        ...styles.statCard,
                                        borderColor: hoveredStat === i ? stat.accent : "#e2e8f0",
                                        transform: hoveredStat === i ? "translateY(-4px)" : "none",
                                        boxShadow: hoveredStat === i
                                            ? `0 10px 24px rgba(0,0,0,0.10)`
                                            : "0 1px 4px rgba(0,0,0,0.07)",
                                    }}
                                    onMouseEnter={() => setHoveredStat(i)}
                                    onMouseLeave={() => setHoveredStat(null)}
                                >
                                    {/* Icon */}
                                    <div style={{ ...styles.statIconWrap, backgroundColor: stat.iconBg }}>
                                        {stat.icon}
                                    </div>

                                    {/* Info */}
                                    <div style={{ ...styles.statInfo, flex: 1 }}>
                                        <span style={{ ...styles.statValue, color: stat.accent }}>
                                            {stat.value}
                                        </span>
                                        <span style={styles.statLabel}>{stat.label}</span>
                                        <span style={{ ...styles.statTrend, color: stat.trendColor }}>
                                            ↑ {stat.trend}
                                        </span>
                                        {/* Progress bar */}
                                        <div style={styles.progressBarWrap}>
                                            <div style={{
                                                ...styles.progressBar,
                                                width: `${stat.progress}%`,
                                                backgroundColor: stat.accent,
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Recent Activity ── */}
                    <div style={styles.activitySection}>

                        <div style={styles.activityHeader}>
                            <p style={styles.activityTitle}>🕒 Recent Activity</p>
                            <button style={styles.activityViewAll}>View All →</button>
                        </div>

                        <div style={styles.activityCard}>
                            {RECENT_ACTIVITY.map((item, i) => {
                                const passed = item.score >= 75;
                                const scoreColor = item.score >= 85 ? "#22c55e"
                                    : item.score >= 60 ? "#f59e0b" : "#ef4444";
                                const badgeBg = item.score >= 85 ? "#dcfce7"
                                    : item.score >= 60 ? "#fef3c7" : "#fee2e2";
                                const badgeColor = item.score >= 85 ? "#15803d"
                                    : item.score >= 60 ? "#92400e" : "#b91c1c";
                                const badgeLabel = item.score >= 85 ? "Excellent"
                                    : item.score >= 60 ? "Good" : "Needs Work";

                                return (
                                    <div key={item.topic}>
                                        <div
                                            style={{
                                                ...styles.activityRow,
                                                backgroundColor: hoveredRow === i ? "#f8fafc" : "#ffffff",
                                            }}
                                            onMouseEnter={() => setHoveredRow(i)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            {/* Icon */}
                                            <div style={{ ...styles.activityIconWrap, backgroundColor: item.iconBg }}>
                                                {item.icon}
                                            </div>

                                            {/* Topic + Date */}
                                            <div style={styles.activityInfo}>
                                                <span style={styles.activityTopic}>{item.topic}</span>
                                                <span style={styles.activityDate}>📅 {item.date}</span>
                                            </div>

                                            {/* Score + Badge */}
                                            <div style={styles.activityRight}>
                                                <span style={{ ...styles.activityScore, color: scoreColor }}>
                                                    {item.score}%
                                                </span>
                                                <span style={{
                                                    ...styles.activityBadge,
                                                    backgroundColor: badgeBg,
                                                    color: badgeColor,
                                                }}>
                                                    {badgeLabel}
                                                </span>
                                            </div>
                                        </div>
                                        {i < RECENT_ACTIVITY.length - 1 && (
                                            <div style={styles.activityRowDivider} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Dashboard;
