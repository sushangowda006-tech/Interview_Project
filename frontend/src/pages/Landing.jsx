import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── Floating particle dots ── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    size:  Math.random() * 5 + 2,
    x:     Math.random() * 100,
    y:     Math.random() * 100,
    delay: Math.random() * 6,
    dur:   Math.random() * 8 + 6,
    color: ["#3b82f6","#a855f7","#06b6d4","#f59e0b","#22c55e"][i % 5],
}));

const FEATURES = [
    { icon: "🧠", text: "60+ Curated Questions" },
    { icon: "⏱️", text: "Timed Quiz Engine" },
    { icon: "📊", text: "Live Score Tracking" },
    { icon: "🏆", text: "Global Leaderboard" },
    { icon: "🔐", text: "Secure JWT Auth" },
    { icon: "📱", text: "Fully Responsive" },
];

const STATS = [
    { val: "6+",   label: "Quiz Topics",     color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
    { val: "60+",  label: "Questions",        color: "#a855f7", bg: "rgba(168,85,247,0.12)"  },
    { val: "100%", label: "Free to Use",      color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
    { val: "24/7", label: "Always Available", color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
];

function Landing() {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);
    const [tick,    setTick]    = useState(0);

    // Subtle continuous re-render for particle animation via CSS — no JS needed
    // Just used to trigger the entrance animation once
    useEffect(() => { setTick(1); }, []);

    return (
        <div style={styles.screen}>

            {/* ── Animated background layer ── */}
            <div style={styles.bgMesh} />
            <div style={styles.bgGlow1} />
            <div style={styles.bgGlow2} />
            <div style={styles.bgGlow3} />

            {/* ── Floating particles ── */}
            {PARTICLES.map(p => (
                <div key={p.id} style={{
                    position: "absolute",
                    width:  p.size + "px",
                    height: p.size + "px",
                    borderRadius: "50%",
                    backgroundColor: p.color,
                    left: p.x + "%",
                    top:  p.y + "%",
                    opacity: 0.35,
                    filter: "blur(0.5px)",
                    animation: `floatDot ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
                    pointerEvents: "none",
                }} />
            ))}

            {/* ── Grid overlay ── */}
            <div style={styles.gridOverlay} />

            {/* ══════════ NAVBAR ══════════ */}
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <div style={styles.navLogo}>
                        <span style={{ fontSize: "18px" }}>🎯</span>
                    </div>
                    <span style={styles.navBrandText}>InterviewPro</span>
                </div>
                <button style={styles.navRegBtn} onClick={() => navigate("/register")}>
                    Get Started Free →
                </button>
            </nav>

            {/* ══════════ HERO ══════════ */}
            <section style={styles.hero} className={tick ? "land-enter" : ""}>

                {/* Top pill badge */}
                <div style={styles.heroBadge}>
                    <span style={styles.heroBadgeDot} />
                    <span>🚀 Now with AI-powered question bank</span>
                </div>

                {/* Main heading */}
                <h1 style={styles.heroTitle}>
                    Ace Your Next
                    <br />
                    <span style={styles.heroGradText}>Technical Interview</span>
                </h1>

                <p style={styles.heroSub}>
                    Practice with real interview questions, track your progress,<br />
                    and compete on the global leaderboard.
                </p>

                {/* CTA buttons */}
                <div style={styles.ctaRow}>
                    <button style={styles.ctaPrimary} onClick={() => navigate("/login")}>
                        <span>👤</span> Start as User
                    </button>
                    <button style={styles.ctaSecondary} onClick={() => navigate("/register")}>
                        Create Free Account →
                    </button>
                </div>

                {/* Trust line */}
                <p style={styles.trustLine}>
                    ✅ No credit card &nbsp;·&nbsp; ✅ Free forever &nbsp;·&nbsp; ✅ Instant access
                </p>
            </section>

            {/* ══════════ STATS ROW ══════════ */}
            <div style={styles.statsRow} className={tick ? "land-enter-delay1" : ""}>
                {STATS.map(st => (
                    <div key={st.label} style={{ ...styles.statBox, backgroundColor: st.bg, borderColor: st.color + "33" }}>
                        <span style={{ ...styles.statVal, color: st.color }}>{st.val}</span>
                        <span style={styles.statLbl}>{st.label}</span>
                    </div>
                ))}
            </div>

            {/* ══════════ LOGIN CARDS ══════════ */}
            <div style={styles.cardsRow} className={tick ? "land-enter-delay2" : ""}>

                {/* User card */}
                <div
                    style={{
                        ...styles.card,
                        ...(hovered === 0 ? styles.cardHoverUser : {}),
                    }}
                    onMouseEnter={() => setHovered(0)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate("/login")}
                >
                    <div style={styles.cardShimmer} />
                    <div style={{ ...styles.cardIconRing, background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}>
                        <span style={{ fontSize: "32px" }}>👤</span>
                    </div>
                    <div style={styles.cardBadgeUser}>User Portal</div>
                    <h3 style={styles.cardTitle}>User Login</h3>
                    <p style={styles.cardDesc}>
                        Take quizzes, track your scores,<br />and climb the leaderboard
                    </p>
                    <ul style={styles.cardFeatures}>
                        <li style={styles.cardFeat}><span style={{ color: "#3b82f6" }}>✓</span> 6 quiz topics</li>
                        <li style={styles.cardFeat}><span style={{ color: "#3b82f6" }}>✓</span> Personal results</li>
                        <li style={styles.cardFeat}><span style={{ color: "#3b82f6" }}>✓</span> Leaderboard access</li>
                    </ul>
                    <button style={styles.cardBtnUser} onClick={e => { e.stopPropagation(); navigate("/login"); }}>
                        Login as User →
                    </button>
                </div>

                {/* Divider */}
                <div style={styles.orDivider}>
                    <div style={styles.orLine} />
                    <span style={styles.orText}>OR</span>
                    <div style={styles.orLine} />
                </div>

                {/* Admin card */}
                <div
                    style={{
                        ...styles.card,
                        ...(hovered === 1 ? styles.cardHoverAdmin : {}),
                    }}
                    onMouseEnter={() => setHovered(1)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate("/admin/login")}
                >
                    <div style={styles.cardShimmer} />
                    <div style={{ ...styles.cardIconRing, background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
                        <span style={{ fontSize: "32px" }}>🛠️</span>
                    </div>
                    <div style={styles.cardBadgeAdmin}>Admin Portal</div>
                    <h3 style={styles.cardTitle}>Admin Login</h3>
                    <p style={styles.cardDesc}>
                        Manage questions, monitor users<br />and view all results
                    </p>
                    <ul style={styles.cardFeatures}>
                        <li style={styles.cardFeat}><span style={{ color: "#a855f7" }}>✓</span> Manage questions</li>
                        <li style={styles.cardFeat}><span style={{ color: "#a855f7" }}>✓</span> View all users</li>
                        <li style={styles.cardFeat}><span style={{ color: "#a855f7" }}>✓</span> Full results access</li>
                    </ul>
                    <button style={styles.cardBtnAdmin} onClick={e => { e.stopPropagation(); navigate("/admin/login"); }}>
                        Login as Admin →
                    </button>
                </div>
            </div>

            {/* ══════════ FEATURES STRIP ══════════ */}
            <div style={styles.featuresStrip} className={tick ? "land-enter-delay3" : ""}>
                {FEATURES.map(f => (
                    <div key={f.text} style={styles.featItem}>
                        <span style={styles.featIcon}>{f.icon}</span>
                        <span style={styles.featText}>{f.text}</span>
                    </div>
                ))}
            </div>

            {/* ══════════ FOOTER ══════════ */}
            <p style={styles.footer}>
                New to InterviewPro?{" "}
                <span style={styles.footerLink} onClick={() => navigate("/register")}>
                    Create a free account →
                </span>
            </p>

        </div>
    );
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const styles = {
    screen: {
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "linear-gradient(160deg, #020817 0%, #0a0f2e 40%, #0d1117 70%, #050a1a 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "0 16px 48px",
        position: "relative", overflow: "hidden",
        color: "#f8fafc",
    },

    // Background layers
    bgMesh: {
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(59,130,246,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 70%)
        `,
    },
    bgGlow1: {
        position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)",
        top: "-200px", left: "-150px", pointerEvents: "none",
    },
    bgGlow2: {
        position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 65%)",
        bottom: "-100px", right: "-100px", pointerEvents: "none",
    },
    bgGlow3: {
        position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)",
        top: "40%", right: "10%", pointerEvents: "none",
    },
    gridOverlay: {
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
    },

    // Navbar
    nav: {
        width: "100%", maxWidth: "1100px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 0", zIndex: 10,
    },
    navBrand: { display: "flex", alignItems: "center", gap: "10px" },
    navLogo: {
        width: "38px", height: "38px", borderRadius: "10px",
        background: "linear-gradient(135deg, #3b82f6, #a855f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    navBrandText: { fontSize: "18px", fontWeight: "800", color: "#f8fafc", letterSpacing: "-0.3px" },
    navRegBtn: {
        backgroundColor: "rgba(255,255,255,0.07)", color: "#f8fafc",
        border: "1px solid rgba(255,255,255,0.15)", padding: "9px 20px",
        borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
        backdropFilter: "blur(8px)",
    },

    // Hero
    hero: {
        textAlign: "center", zIndex: 2, marginTop: "48px", marginBottom: "48px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "20px",
        maxWidth: "780px",
    },
    heroBadge: {
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(168,85,247,0.15))",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#cbd5e1", fontSize: "13px", fontWeight: "600",
        padding: "8px 18px", borderRadius: "99px",
        backdropFilter: "blur(8px)",
    },
    heroBadgeDot: {
        width: "7px", height: "7px", borderRadius: "50%",
        backgroundColor: "#22c55e",
        boxShadow: "0 0 8px #22c55e",
        display: "inline-block",
        animation: "pulseDot 1.8s ease infinite",
    },
    heroTitle: {
        fontSize: "clamp(40px, 7vw, 76px)", fontWeight: "900",
        color: "#f8fafc", margin: 0, lineHeight: 1.08, letterSpacing: "-1.5px",
    },
    heroGradText: {
        background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #06b6d4 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    },
    heroSub: {
        fontSize: "clamp(15px, 2vw, 18px)", color: "#94a3b8",
        lineHeight: 1.7, margin: 0,
    },
    ctaRow: { display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" },
    ctaPrimary: {
        display: "flex", alignItems: "center", gap: "8px",
        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "#fff", border: "none", padding: "14px 32px",
        borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 0 32px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.3)",
    },
    ctaSecondary: {
        backgroundColor: "rgba(255,255,255,0.06)", color: "#f8fafc",
        border: "1px solid rgba(255,255,255,0.15)", padding: "14px 32px",
        borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer",
        backdropFilter: "blur(8px)",
    },
    trustLine: { fontSize: "13px", color: "#475569", margin: 0 },

    // Stats
    statsRow: {
        display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center",
        zIndex: 2, marginBottom: "48px",
    },
    statBox: {
        display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        padding: "18px 28px", borderRadius: "14px", border: "1px solid",
        backdropFilter: "blur(8px)", minWidth: "110px",
    },
    statVal: { fontSize: "28px", fontWeight: "900", lineHeight: 1 },
    statLbl: { fontSize: "12px", color: "#64748b", fontWeight: "500" },

    // Cards
    cardsRow: {
        display: "flex", alignItems: "center", gap: "0px",
        zIndex: 2, marginBottom: "48px", flexWrap: "wrap", justifyContent: "center",
    },
    card: {
        width: "300px", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px",
        padding: "36px 28px", display: "flex", flexDirection: "column",
        alignItems: "center", gap: "14px", cursor: "pointer",
        backdropFilter: "blur(16px)",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        textAlign: "center",
    },
    cardHoverUser: {
        transform: "translateY(-10px) scale(1.02)",
        borderColor: "rgba(59,130,246,0.6)",
        boxShadow: "0 0 40px rgba(59,130,246,0.25), 0 20px 40px rgba(0,0,0,0.4)",
    },
    cardHoverAdmin: {
        transform: "translateY(-10px) scale(1.02)",
        borderColor: "rgba(168,85,247,0.6)",
        boxShadow: "0 0 40px rgba(168,85,247,0.25), 0 20px 40px rgba(0,0,0,0.4)",
    },
    cardShimmer: {
        position: "absolute", top: 0, left: "-100%",
        width: "60%", height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
        pointerEvents: "none",
        animation: "shimmerSlide 3s ease infinite",
    },
    cardIconRing: {
        width: "72px", height: "72px", borderRadius: "20px",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    },
    cardBadgeUser: {
        backgroundColor: "rgba(59,130,246,0.15)", color: "#60a5fa",
        fontSize: "11px", fontWeight: "700", padding: "4px 12px",
        borderRadius: "99px", letterSpacing: "0.5px", textTransform: "uppercase",
        border: "1px solid rgba(59,130,246,0.25)",
    },
    cardBadgeAdmin: {
        backgroundColor: "rgba(168,85,247,0.15)", color: "#c084fc",
        fontSize: "11px", fontWeight: "700", padding: "4px 12px",
        borderRadius: "99px", letterSpacing: "0.5px", textTransform: "uppercase",
        border: "1px solid rgba(168,85,247,0.25)",
    },
    cardTitle: { fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: 0 },
    cardDesc:  { fontSize: "13px", color: "#94a3b8", margin: 0, lineHeight: 1.6 },
    cardFeatures: { listStyle: "none", padding: 0, margin: 0, width: "100%", display: "flex", flexDirection: "column", gap: "6px" },
    cardFeat: { fontSize: "13px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" },
    cardBtnUser: {
        width: "100%", padding: "13px",
        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "#fff", border: "none", borderRadius: "12px",
        fontSize: "14px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
        marginTop: "4px",
    },
    cardBtnAdmin: {
        width: "100%", padding: "13px",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#fff", border: "none", borderRadius: "12px",
        fontSize: "14px", fontWeight: "700", cursor: "pointer",
        boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
        marginTop: "4px",
    },

    // OR divider between cards
    orDivider: {
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "12px", padding: "0 24px", zIndex: 1,
    },
    orLine: { width: "1px", height: "60px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)" },
    orText: { fontSize: "12px", fontWeight: "700", color: "#475569", letterSpacing: "1px" },

    // Features strip
    featuresStrip: {
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px",
        zIndex: 2, marginBottom: "32px", maxWidth: "800px",
    },
    featItem: {
        display: "flex", alignItems: "center", gap: "8px",
        backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        padding: "10px 18px", borderRadius: "99px",
        backdropFilter: "blur(8px)",
    },
    featIcon: { fontSize: "16px" },
    featText: { fontSize: "13px", color: "#94a3b8", fontWeight: "500" },

    // Footer
    footer: { fontSize: "14px", color: "#475569", zIndex: 2 },
    footerLink: { color: "#60a5fa", fontWeight: "600", cursor: "pointer" },
};

export default Landing;
