import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
    id: i, size: Math.random() * 5 + 2,
    x: Math.random() * 100, y: Math.random() * 100,
    delay: Math.random() * 6, dur: Math.random() * 8 + 6,
    color: ["#3b82f6","#a855f7","#06b6d4","#f59e0b","#22c55e"][i % 5],
}));

const FEATURES = [
    { icon: "🧠", title: "60+ Curated Questions",    desc: "Hand-picked questions across 6 key topics covering Java, Spring Boot, SQL, React, REST APIs and Security.",  color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
    { icon: "⏱️", title: "Timed Quiz Engine",         desc: "Difficulty-based timers — Easy 8 min, Medium 5 min, Hard 3 min. Auto-submits when time runs out.",           color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
    { icon: "📊", title: "Score History & Charts",    desc: "Line charts and bar charts showing your score trend over time and best performance per topic.",               color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
    { icon: "🏆", title: "Global Leaderboard",        desc: "Compete with other users. Filter by topic to see who's the best in Java OOP, Spring Boot, and more.",        color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
    { icon: "📖", title: "Review Mode",               desc: "After every quiz, review all answers with detailed explanations so you actually learn from mistakes.",        color: "#a855f7", bg: "rgba(168,85,247,0.1)"  },
    { icon: "🔥", title: "Daily Streak System",       desc: "Build a daily practice habit. Earn streak badges and unlock the Week Warrior achievement at 7 days.",        color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
    { icon: "🔖", title: "Smart Bookmarks",           desc: "Wrong answers are auto-saved as bookmarks. Practice them until you get them right — they remove themselves.", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)"  },
    { icon: "🛡️", title: "Secure JWT Auth",           desc: "Industry-standard JWT authentication with BCrypt password hashing and role-based access control.",           color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
];

const STEPS = [
    { num: "01", icon: "📝", title: "Create Account",   desc: "Register for free in seconds. No credit card required." },
    { num: "02", icon: "🎯", title: "Pick a Topic",     desc: "Choose from 6 topics and select your difficulty level."  },
    { num: "03", icon: "⚡", title: "Take the Quiz",    desc: "Answer questions against the clock. Stay focused!"       },
    { num: "04", icon: "📈", title: "Track Progress",   desc: "Review results, check charts, and climb the leaderboard."},
];

const TESTIMONIALS = [
    { name: "Arjun Sharma",   role: "Java Developer",        avatar: "A", color: "#3b82f6", text: "This platform helped me crack my Java interview at a top MNC. The timed quizzes really simulate real interview pressure. Highly recommend!" },
    { name: "Priya Nair",     role: "Full Stack Developer",  avatar: "P", color: "#a855f7", text: "The review mode with explanations is a game changer. I went from 60% to 90% in Spring Boot in just one week of daily practice." },
    { name: "Rahul Verma",    role: "Backend Engineer",      avatar: "R", color: "#22c55e", text: "Love the leaderboard feature! It keeps me motivated to practice every day. The streak system is addictive in the best way possible." },
    { name: "Sneha Patel",    role: "Software Engineer",     avatar: "S", color: "#f59e0b", text: "The bookmark feature is brilliant. Wrong answers get saved automatically and I can practice them until I master them. 10/10!" },
    { name: "Kiran Kumar",    role: "React Developer",       avatar: "K", color: "#ef4444", text: "Score history charts helped me see exactly where I was improving. Went from 55% to 88% average in React Basics over 2 weeks." },
    { name: "Divya Menon",    role: "Security Engineer",     avatar: "D", color: "#0ea5e9", text: "The JWT & Security topic is incredibly well-curated. Perfect for anyone preparing for backend security interviews." },
];

const STATS = [
    { val: "6+",   label: "Quiz Topics",     color: "#3b82f6" },
    { val: "60+",  label: "Questions",        color: "#a855f7" },
    { val: "100%", label: "Free to Use",      color: "#22c55e" },
    { val: "24/7", label: "Always Available", color: "#f59e0b" },
];

const s = {
    screen: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(160deg, #020817 0%, #0a0f2e 40%, #0d1117 70%, #050a1a 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#f8fafc", position: "relative", overflow: "hidden" },
    bgGlow1: { position: "absolute", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)", top: "-200px", left: "-200px", pointerEvents: "none" },
    bgGlow2: { position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)", bottom: "0", right: "-150px", pointerEvents: "none" },
    grid:    { position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" },
    wrap:    { width: "100%", maxWidth: "1100px", padding: "0 24px", zIndex: 2 },

    // Navbar
    nav:     { width: "100%", maxWidth: "1100px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", zIndex: 10 },
    logo:    { display: "flex", alignItems: "center", gap: "10px" },
    logoBox: { width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" },
    logoTxt: { fontSize: "18px", fontWeight: "800", color: "#f8fafc" },
    navLinks:{ display: "flex", alignItems: "center", gap: "8px" },
    navLink: { backgroundColor: "rgba(255,255,255,0.06)", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    navCta:  { background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 0 20px rgba(59,130,246,0.3)" },

    // Hero
    hero:    { textAlign: "center", padding: "80px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", maxWidth: "820px", zIndex: 2 },
    badge:   { display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(90deg, rgba(59,130,246,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(255,255,255,0.12)", color: "#cbd5e1", fontSize: "13px", fontWeight: "600", padding: "8px 18px", borderRadius: "99px" },
    dot:     { width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block", animation: "pulseDot 1.8s ease infinite" },
    h1:      { fontSize: "clamp(38px, 7vw, 76px)", fontWeight: "900", color: "#f8fafc", margin: 0, lineHeight: 1.08, letterSpacing: "-1.5px" },
    grad:    { background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
    sub:     { fontSize: "clamp(15px, 2vw, 18px)", color: "#94a3b8", lineHeight: 1.7, margin: 0 },
    ctaRow:  { display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" },
    ctaMain: { display: "flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 0 32px rgba(59,130,246,0.4)" },
    ctaSec:  { backgroundColor: "rgba(255,255,255,0.06)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.15)", padding: "16px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
    trust:   { fontSize: "13px", color: "#475569", margin: 0 },

    // Stats
    statsRow:{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", zIndex: 2, marginBottom: "80px" },
    statBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "18px 32px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" },
    statVal: { fontSize: "30px", fontWeight: "900", lineHeight: 1 },
    statLbl: { fontSize: "12px", color: "#64748b", fontWeight: "500" },

    // Section
    section:     { width: "100%", maxWidth: "1100px", padding: "0 24px 80px", zIndex: 2 },
    sectionLabel:{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#3b82f6", marginBottom: "12px" },
    sectionTitle:{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "900", color: "#f8fafc", margin: "0 0 12px", lineHeight: 1.2 },
    sectionSub:  { fontSize: "16px", color: "#64748b", margin: "0 0 48px", lineHeight: 1.6 },

    // Features grid
    featGrid:{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
    featCard:{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transition: "transform 0.2s ease, border-color 0.2s ease" },
    featIcon:{ width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
    featTitle:{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: 0 },
    featDesc: { fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.6 },

    // Steps
    stepsRow:{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" },
    step:    { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 16px", position: "relative" },
    stepLine:{ position: "absolute", top: "28px", left: "50%", width: "100%", height: "1px", background: "linear-gradient(90deg, rgba(59,130,246,0.4), rgba(168,85,247,0.4))", zIndex: 0 },
    stepNum: { width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900", color: "#fff", zIndex: 1, marginBottom: "16px", boxShadow: "0 0 24px rgba(59,130,246,0.3)" },
    stepTitle:{ fontSize: "15px", fontWeight: "700", color: "#f8fafc", margin: "0 0 8px" },
    stepDesc: { fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.5 },

    // Testimonials
    testGrid:{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
    testCard:{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" },
    testText:{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, margin: 0, fontStyle: "italic" },
    testAuthor:{ display: "flex", alignItems: "center", gap: "12px" },
    testAvatar:{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "16px", color: "#fff", flexShrink: 0 },
    testName:{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: 0 },
    testRole:{ fontSize: "12px", color: "#64748b", margin: 0 },
    stars:   { color: "#f59e0b", fontSize: "14px", letterSpacing: "2px" },

    // CTA Banner
    ctaBanner:{ width: "100%", maxWidth: "1100px", padding: "0 24px 80px", zIndex: 2 },
    ctaBox:  { background: "linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)", borderRadius: "24px", padding: "60px 48px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 4px 40px rgba(29,78,216,0.3)" },
    ctaGlow: { position: "absolute", width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", top: "-100px", right: "-60px" },
    ctaH2:   { fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "900", color: "#fff", margin: "0 0 12px", zIndex: 1, position: "relative" },
    ctaSub2: { fontSize: "16px", color: "#93c5fd", margin: "0 0 32px", zIndex: 1, position: "relative" },
    ctaBtns: { display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", zIndex: 1, position: "relative" },
    ctaBtn1: { background: "#ffffff", color: "#1d4ed8", border: "none", padding: "14px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer" },
    ctaBtn2: { backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "14px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" },

    // Footer
    footer:  { width: "100%", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", zIndex: 2, maxWidth: "1100px" },
    footerL: { display: "flex", alignItems: "center", gap: "10px" },
    footerR: { fontSize: "13px", color: "#475569" },
    footerLink:{ color: "#60a5fa", cursor: "pointer", fontWeight: "600" },
};

function Landing() {
    const navigate = useNavigate();
    const [tick,       setTick]       = useState(0);
    const [hovFeat,    setHovFeat]    = useState(null);
    const [hovTest,    setHovTest]    = useState(null);

    useEffect(() => { setTick(1); }, []);

    return (
        <div style={s.screen}>
            <div style={s.bgGlow1} />
            <div style={s.bgGlow2} />
            <div style={s.grid} />

            {/* Particles */}
            {PARTICLES.map(p => (
                <div key={p.id} style={{ position: "absolute", width: p.size + "px", height: p.size + "px", borderRadius: "50%", backgroundColor: p.color, left: p.x + "%", top: p.y + "%", opacity: 0.3, animation: `floatDot ${p.dur}s ease-in-out ${p.delay}s infinite alternate`, pointerEvents: "none" }} />
            ))}

            {/* ── Navbar ── */}
            <nav style={s.nav}>
                <div style={s.logo}>
                    <div style={s.logoBox}>🎯</div>
                    <span style={s.logoTxt}>InterviewPro</span>
                </div>
                <div style={s.navLinks}>
                    <button style={s.navLink} onClick={() => { const el = document.getElementById("features"); el?.scrollIntoView({ behavior: "smooth" }); }}>Features</button>
                    <button style={s.navLink} onClick={() => { const el = document.getElementById("testimonials"); el?.scrollIntoView({ behavior: "smooth" }); }}>Reviews</button>
                    <button style={s.navLink} onClick={() => navigate("/login")}>Login</button>
                    <button style={s.navCta}  onClick={() => navigate("/register")}>Get Started Free →</button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={s.hero} className={tick ? "land-enter" : ""}>
                <div style={s.badge}>
                    <span style={s.dot} />
                    🚀 Trusted by 1000+ developers preparing for interviews
                </div>
                <h1 style={s.h1}>
                    Ace Your Next<br />
                    <span style={s.grad}>Technical Interview</span>
                </h1>
                <p style={s.sub}>
                    Practice with real interview questions, track your progress,<br />
                    and compete on the global leaderboard.
                </p>
                <div style={s.ctaRow}>
                    <button style={s.ctaMain} onClick={() => navigate("/register")}>
                        🚀 Get Started Free
                    </button>
                    <button style={s.ctaSec} onClick={() => navigate("/login")}>
                        Sign In →
                    </button>
                </div>
                <p style={s.trust}>✅ No credit card &nbsp;·&nbsp; ✅ Free forever &nbsp;·&nbsp; ✅ Instant access</p>
            </section>

            {/* ── Stats ── */}
            <div style={s.statsRow} className={tick ? "land-enter-delay1" : ""}>
                {STATS.map(st => (
                    <div key={st.label} style={s.statBox}>
                        <span style={{ ...s.statVal, color: st.color }}>{st.val}</span>
                        <span style={s.statLbl}>{st.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Features ── */}
            <section id="features" style={s.section} className={tick ? "land-enter-delay2" : ""}>
                <p style={s.sectionLabel}>Features</p>
                <h2 style={s.sectionTitle}>Everything you need to<br />land your dream job</h2>
                <p style={s.sectionSub}>A complete interview preparation platform built for developers.</p>
                <div style={{ ...s.featGrid, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                    {FEATURES.map((f, i) => (
                        <div key={f.title}
                            style={{
                                ...s.featCard,
                                borderColor: hovFeat === i ? f.color + "66" : "rgba(255,255,255,0.08)",
                                transform: hovFeat === i ? "translateY(-6px)" : "none",
                                boxShadow: hovFeat === i ? `0 12px 32px rgba(0,0,0,0.3)` : "none",
                            }}
                            onMouseEnter={() => setHovFeat(i)}
                            onMouseLeave={() => setHovFeat(null)}
                        >
                            <div style={{ ...s.featIcon, backgroundColor: f.bg }}>{f.icon}</div>
                            <p style={s.featTitle}>{f.title}</p>
                            <p style={s.featDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section style={s.section}>
                <p style={s.sectionLabel}>How It Works</p>
                <h2 style={s.sectionTitle}>Start practicing in 4 simple steps</h2>
                <p style={s.sectionSub}>Get up and running in under 2 minutes.</p>
                <div style={{ ...s.stepsRow, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                    {STEPS.map((step, i) => (
                        <div key={step.num} style={s.step}>
                            {i < STEPS.length - 1 && <div style={s.stepLine} />}
                            <div style={s.stepNum}>{step.icon}</div>
                            <p style={s.stepTitle}>{step.title}</p>
                            <p style={s.stepDesc}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section id="testimonials" style={s.section}>
                <p style={s.sectionLabel}>Testimonials</p>
                <h2 style={s.sectionTitle}>Loved by developers<br />across India</h2>
                <p style={s.sectionSub}>See what our users say about their interview preparation journey.</p>
                <div style={{ ...s.testGrid, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div key={t.name}
                            style={{
                                ...s.testCard,
                                borderColor: hovTest === i ? t.color + "44" : "rgba(255,255,255,0.08)",
                                transform: hovTest === i ? "translateY(-4px)" : "none",
                                transition: "transform 0.2s ease, border-color 0.2s ease",
                            }}
                            onMouseEnter={() => setHovTest(i)}
                            onMouseLeave={() => setHovTest(null)}
                        >
                            <div style={s.stars}>★★★★★</div>
                            <p style={s.testText}>"{t.text}"</p>
                            <div style={s.testAuthor}>
                                <div style={{ ...s.testAvatar, backgroundColor: t.color }}>{t.avatar}</div>
                                <div>
                                    <p style={s.testName}>{t.name}</p>
                                    <p style={s.testRole}>{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <div style={s.ctaBanner}>
                <div style={s.ctaBox}>
                    <div style={s.ctaGlow} />
                    <h2 style={s.ctaH2}>Ready to ace your interview? 🚀</h2>
                    <p style={s.ctaSub2}>Join thousands of developers who are already preparing smarter.</p>
                    <div style={s.ctaBtns}>
                        <button style={s.ctaBtn1} onClick={() => navigate("/register")}>Create Free Account</button>
                        <button style={s.ctaBtn2} onClick={() => navigate("/login")}>Sign In</button>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer style={s.footer}>
                <div style={s.footerL}>
                    <div style={s.logoBox}>🎯</div>
                    <span style={{ ...s.logoTxt, fontSize: "15px" }}>InterviewPro</span>
                </div>
                <p style={s.footerR}>
                    © 2025 InterviewPro · Built with ❤️ ·{" "}
                    <span style={s.footerLink} onClick={() => navigate("/register")}>Get Started Free →</span>
                </p>
            </footer>

        </div>
    );
}

export default Landing;
