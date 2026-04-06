import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Prebuilt Questions ──────────────────────────────────────────
const QUESTION_BANK = {
    "Java OOP": [
        { q: "What is encapsulation in Java?", options: ["Hiding data using access modifiers", "Inheriting from a class", "Overloading methods", "Creating objects"], answer: "A" },
        { q: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: "B" },
        { q: "What is polymorphism?", options: ["One class, many objects", "One interface, many implementations", "Multiple inheritance", "None"], answer: "B" },
        { q: "What does the 'final' keyword do to a class?", options: ["Makes it abstract", "Prevents inheritance", "Makes it static", "Hides it"], answer: "B" },
        { q: "Which OOP concept is achieved by method overriding?", options: ["Encapsulation", "Abstraction", "Polymorphism", "Inheritance"], answer: "C" },
        { q: "What is an abstract class?", options: ["A class with no methods", "A class that cannot be instantiated", "A class with only static methods", "A final class"], answer: "B" },
        { q: "What is the use of 'super' keyword?", options: ["Refers to current object", "Refers to parent class", "Creates a new object", "Calls static method"], answer: "B" },
        { q: "Which of these supports multiple inheritance in Java?", options: ["Class", "Abstract Class", "Interface", "Enum"], answer: "C" },
        { q: "What is a constructor?", options: ["A method that returns a value", "A method called on object creation", "A static method", "A final method"], answer: "B" },
        { q: "What is method overloading?", options: ["Same method name, different parameters", "Same method name, same parameters", "Overriding parent method", "None of the above"], answer: "A" },
    ],
    "Spring Boot": [
        { q: "What annotation marks a Spring Boot main class?", options: ["@SpringApplication", "@SpringBootApplication", "@EnableAutoConfig", "@BootStart"], answer: "B" },
        { q: "Which annotation is used to create a REST controller?", options: ["@Controller", "@Service", "@RestController", "@Component"], answer: "C" },
        { q: "What does @Autowired do?", options: ["Creates a new bean", "Injects a dependency automatically", "Marks a REST endpoint", "Configures the database"], answer: "B" },
        { q: "Which file is used for Spring Boot configuration?", options: ["config.xml", "application.properties", "spring.json", "boot.yaml"], answer: "B" },
        { q: "What is the default port of Spring Boot?", options: ["3000", "8080", "1212", "5000"], answer: "B" },
        { q: "Which annotation maps HTTP GET requests?", options: ["@PostMapping", "@PutMapping", "@GetMapping", "@RequestMapping"], answer: "C" },
        { q: "What does @Entity annotation do?", options: ["Marks a REST endpoint", "Marks a class as a JPA table", "Creates a service", "Injects a bean"], answer: "B" },
        { q: "Which annotation is used for dependency injection via constructor?", options: ["@Inject", "@Autowired", "@Bean", "@Component"], answer: "B" },
        { q: "What is Spring Security used for?", options: ["Database access", "Authentication and authorization", "REST API creation", "Logging"], answer: "B" },
        { q: "What does JPA stand for?", options: ["Java Persistence API", "Java Program Architecture", "Java Public Access", "None"], answer: "A" },
    ],
    "SQL & Databases": [
        { q: "Which SQL command retrieves data?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], answer: "C" },
        { q: "What does PRIMARY KEY do?", options: ["Allows duplicate values", "Uniquely identifies each row", "Links two tables", "Encrypts data"], answer: "B" },
        { q: "Which JOIN returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: "D" },
        { q: "What is a FOREIGN KEY?", options: ["A key that encrypts data", "A key that links two tables", "A unique identifier", "An index"], answer: "B" },
        { q: "Which command removes all rows from a table?", options: ["DROP", "DELETE", "TRUNCATE", "REMOVE"], answer: "C" },
        { q: "What does GROUP BY do?", options: ["Sorts results", "Groups rows with same values", "Filters rows", "Joins tables"], answer: "B" },
        { q: "Which aggregate function counts rows?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: "C" },
        { q: "What is normalization?", options: ["Encrypting data", "Organizing data to reduce redundancy", "Indexing tables", "Backing up data"], answer: "B" },
        { q: "Which clause filters grouped results?", options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], answer: "B" },
        { q: "What does INDEX do in SQL?", options: ["Deletes duplicate rows", "Speeds up data retrieval", "Creates a new table", "Joins tables"], answer: "B" },
    ],
    "React Basics": [
        { q: "What is JSX?", options: ["A JavaScript framework", "A syntax extension for JavaScript", "A CSS library", "A database query language"], answer: "B" },
        { q: "Which hook manages state in React?", options: ["useEffect", "useContext", "useState", "useRef"], answer: "C" },
        { q: "What does useEffect do?", options: ["Manages state", "Handles side effects", "Creates context", "Renders components"], answer: "B" },
        { q: "What is a React component?", options: ["A CSS class", "A reusable UI piece", "A database model", "A REST endpoint"], answer: "B" },
        { q: "How do you pass data to a child component?", options: ["Using state", "Using props", "Using context only", "Using refs"], answer: "B" },
        { q: "What does the key prop do in a list?", options: ["Styles the element", "Helps React identify changed items", "Passes data to parent", "Creates a ref"], answer: "B" },
        { q: "Which method triggers a re-render?", options: ["setState / useState setter", "useRef", "useCallback", "useMemo"], answer: "A" },
        { q: "What is the virtual DOM?", options: ["A real browser DOM", "A lightweight copy of the real DOM", "A CSS framework", "A state manager"], answer: "B" },
        { q: "What does React Router do?", options: ["Manages state", "Handles navigation between pages", "Fetches API data", "Styles components"], answer: "B" },
        { q: "Which hook runs code after every render?", options: ["useState", "useRef", "useEffect", "useContext"], answer: "C" },
    ],
    "REST APIs": [
        { q: "What does REST stand for?", options: ["Remote Execution State Transfer", "Representational State Transfer", "Request State Transfer", "None"], answer: "B" },
        { q: "Which HTTP method creates a resource?", options: ["GET", "PUT", "POST", "DELETE"], answer: "C" },
        { q: "What status code means 'Not Found'?", options: ["200", "401", "404", "500"], answer: "C" },
        { q: "What status code means 'OK'?", options: ["201", "200", "204", "301"], answer: "B" },
        { q: "Which HTTP method updates a resource?", options: ["GET", "POST", "PUT", "DELETE"], answer: "C" },
        { q: "What is an API endpoint?", options: ["A database table", "A URL that accepts requests", "A CSS class", "A React component"], answer: "B" },
        { q: "What does a 401 status code mean?", options: ["Not Found", "Server Error", "Unauthorized", "Forbidden"], answer: "C" },
        { q: "What format do REST APIs commonly use?", options: ["XML only", "CSV", "JSON", "HTML"], answer: "C" },
        { q: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Client Object Request Service", "Cross Object REST Service", "None"], answer: "A" },
        { q: "Which HTTP method deletes a resource?", options: ["GET", "POST", "PUT", "DELETE"], answer: "D" },
    ],
    "Security & JWT": [
        { q: "What does JWT stand for?", options: ["Java Web Token", "JSON Web Token", "JavaScript Web Transfer", "None"], answer: "B" },
        { q: "How many parts does a JWT have?", options: ["1", "2", "3", "4"], answer: "C" },
        { q: "What is the purpose of BCrypt?", options: ["Encrypting network traffic", "Hashing passwords securely", "Generating JWT tokens", "Managing sessions"], answer: "B" },
        { q: "Where is JWT typically sent in a request?", options: ["Request body", "Cookie only", "Authorization header", "URL parameter"], answer: "C" },
        { q: "What does the JWT signature do?", options: ["Encrypts the payload", "Verifies the token wasn't tampered", "Stores user data", "Expires the token"], answer: "B" },
        { q: "What is HTTPS?", options: ["HTTP with speed boost", "HTTP with SSL/TLS encryption", "A REST method", "A database protocol"], answer: "B" },
        { q: "What is SQL Injection?", options: ["A Java annotation", "Malicious SQL inserted into queries", "A database backup method", "A Spring Security feature"], answer: "B" },
        { q: "What does @PreAuthorize do in Spring Security?", options: ["Encrypts passwords", "Restricts method access by role", "Generates JWT", "Configures CORS"], answer: "B" },
        { q: "What is XSS?", options: ["Cross-Site Scripting attack", "A CSS framework", "A Java library", "A REST method"], answer: "A" },
        { q: "What is the role of a Refresh Token?", options: ["Encrypts data", "Obtains a new access token without re-login", "Stores user info", "Validates passwords"], answer: "B" },
    ],
};

// ── Styles ──────────────────────────────────────────────────────
const s = {
    screen:  { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:  { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:   { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:    { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "28px", maxWidth: "1100px", width: "100%", margin: "0 auto" },

    sectionLabel: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },
    topicGrid:    { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" },
    topicCard:    { backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", border: "2px solid #e2e8f0", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", transition: "transform 0.18s ease, box-shadow 0.18s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    topicIconWrap:{ width: "48px", height: "48px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
    topicName:    { fontSize: "15px", fontWeight: "700", margin: 0 },
    topicMeta:    { display: "flex", alignItems: "center", justifyContent: "space-between" },
    topicQCount:  { fontSize: "12px", color: "#64748b" },
    diffBadge:    { fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "99px" },

    startBtn: { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "14px 48px", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,0.35)" },
    startBtnOff: { backgroundColor: "#cbd5e1", color: "#fff", border: "none", padding: "14px 48px", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "not-allowed" },

    // Quiz engine
    quizWrap:     { backgroundColor: "#ffffff", borderRadius: "16px", padding: "36px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "28px" },
    progressBar:  { height: "6px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    progressFill: { height: "100%", backgroundColor: "#3b82f6", borderRadius: "99px", transition: "width 0.4s ease" },
    qMeta:        { display: "flex", justifyContent: "space-between", alignItems: "center" },
    qNumber:      { fontSize: "13px", fontWeight: "600", color: "#64748b" },
    qTimer:       { fontSize: "13px", fontWeight: "700", color: "#ef4444", backgroundColor: "#fee2e2", padding: "4px 12px", borderRadius: "99px" },
    qText:        { fontSize: "18px", fontWeight: "700", color: "#1e293b", lineHeight: 1.5 },
    optionsGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
    optionBtn:    { padding: "14px 18px", borderRadius: "10px", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "14px", fontWeight: "500", cursor: "pointer", textAlign: "left", transition: "all 0.15s ease", color: "#1e293b" },
    nextBtn:      { alignSelf: "flex-end", backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "11px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },

    // Result screen
    resultScreen:  { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "860px", width: "100%", margin: "0 auto" },
    resultHero:    { background: "linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)", borderRadius: "20px", padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative", overflow: "hidden", textAlign: "center" },
    heroGlow:      { position: "absolute", width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", top: "-60px", right: "-40px" },
    heroEmoji:     { fontSize: "72px", zIndex: 1 },
    heroPct:       { fontSize: "72px", fontWeight: "900", lineHeight: 1, zIndex: 1 },
    heroTitle:     { fontSize: "24px", fontWeight: "800", color: "#ffffff", margin: 0, zIndex: 1 },
    heroSub:       { fontSize: "14px", color: "#cbd5e1", margin: 0, zIndex: 1 },
    statsRow:      { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    statBox:       { backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px" },
    statBoxIcon:   { fontSize: "28px" },
    statBoxVal:    { fontSize: "28px", fontWeight: "900", lineHeight: 1 },
    statBoxLabel:  { fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
    feedbackBox:   { backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "16px" },
    feedbackTitle: { fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 },
    feedbackBar:   { display: "flex", flexDirection: "column", gap: "6px" },
    fbLabel:       { display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600" },
    fbTrack:       { height: "10px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    fbFill:        { height: "100%", borderRadius: "99px", transition: "width 0.6s ease" },
    reviewBox:     { backgroundColor: "#ffffff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
    reviewHead:    { padding: "16px 24px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontSize: "15px", fontWeight: "700", color: "#1e293b" },
    reviewRow:     { display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 24px", borderBottom: "1px solid #f1f5f9" },
    reviewNum:     { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
    reviewQ:       { fontSize: "13px", fontWeight: "600", color: "#1e293b", margin: "0 0 4px" },
    reviewAns:     { fontSize: "12px", color: "#64748b" },
    resultBtns:    { display: "flex", gap: "14px", justifyContent: "center", paddingBottom: "32px" },
    retryBtn:      { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "13px 32px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,0.3)" },
    dashBtn:       { backgroundColor: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", padding: "13px 32px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
};

const TOPICS = [
    { icon: "☕", name: "Java OOP",        difficulty: "Medium", iconBg: "#fef3c7", accent: "#f59e0b", diff: { bg: "#fef3c7", color: "#92400e" } },
    { icon: "🌱", name: "Spring Boot",     difficulty: "Hard",   iconBg: "#dcfce7", accent: "#22c55e", diff: { bg: "#fee2e2", color: "#b91c1c" } },
    { icon: "🗄️", name: "SQL & Databases", difficulty: "Easy",   iconBg: "#eff6ff", accent: "#3b82f6", diff: { bg: "#dcfce7", color: "#15803d" } },
    { icon: "⚛️", name: "React Basics",    difficulty: "Medium", iconBg: "#fdf4ff", accent: "#a855f7", diff: { bg: "#fef3c7", color: "#92400e" } },
    { icon: "🔗", name: "REST APIs",       difficulty: "Medium", iconBg: "#eff6ff", accent: "#0ea5e9", diff: { bg: "#fef3c7", color: "#92400e" } },
    { icon: "🔐", name: "Security & JWT",  difficulty: "Hard",   iconBg: "#fdf4ff", accent: "#ec4899", diff: { bg: "#fee2e2", color: "#b91c1c" } },
];

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = {
    default:   { border: "#e2e8f0", bg: "#f8fafc",  color: "#1e293b" },
    selected:  { border: "#3b82f6", bg: "#eff6ff",  color: "#1d4ed8" },
    correct:   { border: "#22c55e", bg: "#dcfce7",  color: "#15803d" },
    wrong:     { border: "#ef4444", bg: "#fee2e2",  color: "#b91c1c" },
};

function getOptionStyle(base, label, selected, answered, correctAnswer) {
    if (!answered) return selected === label ? OPTION_COLORS.selected : OPTION_COLORS.default;
    if (label === correctAnswer) return OPTION_COLORS.correct;
    if (label === selected)      return OPTION_COLORS.wrong;
    return OPTION_COLORS.default;
}

function Quiz() {
    const navigate = useNavigate();

    // ── Topic selection state ──
    const [topicIdx,  setTopicIdx]  = useState(null);
    const [hovered,   setHovered]   = useState(null);
    const [quizStarted, setQuizStarted] = useState(false);

    // ── Quiz engine state ──
    const [questions,  setQuestions]  = useState([]);
    const [current,    setCurrent]    = useState(0);
    const [selected,   setSelected]   = useState(null);
    const [answered,   setAnswered]   = useState(false);
    const [score,      setScore]      = useState(0);
    const [finished,   setFinished]   = useState(false);
    const [userAnswers, setUserAnswers] = useState([]);

    const handleStartQuiz = () => {
        setQuizStarted(true); // show loading
        setTimeout(() => {
            const qs = QUESTION_BANK[TOPICS[topicIdx].name];
            setQuestions(qs);
            setCurrent(0);
            setSelected(null);
            setAnswered(false);
            setScore(0);
            setFinished(false);
            setUserAnswers([]);
        }, 700);
    };

    const handleSelect = (label) => {
        if (answered) return;
        setSelected(label);
        setAnswered(true);
        const correct = label === questions[current].answer;
        if (correct) setScore(s => s + 1);
        setUserAnswers(prev => [...prev, { label, correct }]);
    };

    const handleNext = async () => {
        if (current + 1 >= questions.length) {
            const pct = Math.round((score / questions.length) * 100);

            // ── Save to localStorage ──
            const token = localStorage.getItem("token") || "";
            let email = "User";
            try { email = JSON.parse(atob(token.split(".")[1])).sub || "User"; } catch {}

            const entry = {
                name: email, score: pct,
                topic: TOPICS[topicIdx].name,
                date: new Date().toLocaleDateString(),
            };
            const existing = JSON.parse(localStorage.getItem("leaderboard") || "[]");
            const filtered = existing.filter(e => !(e.name === entry.name && e.topic === entry.topic));
            localStorage.setItem("leaderboard", JSON.stringify([...filtered, entry].sort((a, b) => b.score - a.score)));

            // ── Save to backend DB ──
            try {
                await API.post("/results/save", {
                    topic: TOPICS[topicIdx].name,
                    score: score,
                    totalQuestions: questions.length,
                    percentage: pct,
                });
            } catch (err) {
                console.warn("Backend save failed:", err.response?.data || err.message);
            }

            setFinished(true);
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
            setAnswered(false);
        }
    };

    const handleRetry = () => {
        setQuizStarted(false);
        setTopicIdx(null);
        setFinished(false);
    };

    // ── RESULT SCREEN ──
    if (finished) {
        const pct        = Math.round((score / questions.length) * 100);
        const wrong      = questions.length - score;
        const emoji      = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪";
        const message    = pct >= 80 ? "Excellent Work!" : pct >= 60 ? "Good Job!" : "Keep Practicing!";
        const scoreColor = pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
        const grade      = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 60 ? "C" : "D";
        const correctPct = Math.round((score / questions.length) * 100);
        const wrongPct   = Math.round((wrong / questions.length) * 100);

        return (
            <div style={s.screen}>
                <nav style={s.navbar}>
                    <span style={s.brand}>• Interview System</span>
                    <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
                </nav>

                <div style={s.resultScreen} className="page-enter">

                    {/* ── Hero Banner ── */}
                    <div style={s.resultHero}>
                        <div style={s.heroGlow} />
                        <span style={s.heroEmoji}>{emoji}</span>
                        <p style={{ ...s.heroPct, color: scoreColor }}>{pct}%</p>
                        <h2 style={s.heroTitle}>{message}</h2>
                        <p style={s.heroSub}>
                            {TOPICS[topicIdx].icon} {TOPICS[topicIdx].name} &nbsp;·&nbsp; {TOPICS[topicIdx].difficulty}
                        </p>
                    </div>

                    {/* ── 3 Stat Boxes ── */}
                    <div style={s.statsRow}>
                        <div style={s.statBox}>
                            <span style={s.statBoxIcon}>✅</span>
                            <span style={{ ...s.statBoxVal, color: "#22c55e" }}>{score}</span>
                            <span style={s.statBoxLabel}>Correct</span>
                        </div>
                        <div style={s.statBox}>
                            <span style={s.statBoxIcon}>❌</span>
                            <span style={{ ...s.statBoxVal, color: "#ef4444" }}>{wrong}</span>
                            <span style={s.statBoxLabel}>Wrong</span>
                        </div>
                        <div style={s.statBox}>
                            <span style={s.statBoxIcon}>🎓</span>
                            <span style={{ ...s.statBoxVal, color: scoreColor }}>Grade {grade}</span>
                            <span style={s.statBoxLabel}>Out of {questions.length} Qs</span>
                        </div>
                    </div>

                    {/* ── Performance Bars ── */}
                    <div style={s.feedbackBox}>
                        <p style={s.feedbackTitle}>📊 Performance Breakdown</p>

                        <div style={s.feedbackBar}>
                            <div style={s.fbLabel}>
                                <span style={{ color: "#15803d" }}>✅ Correct Answers</span>
                                <span style={{ color: "#15803d" }}>{score}/{questions.length}</span>
                            </div>
                            <div style={s.fbTrack}>
                                <div style={{ ...s.fbFill, width: `${correctPct}%`, backgroundColor: "#22c55e" }} />
                            </div>
                        </div>

                        <div style={s.feedbackBar}>
                            <div style={s.fbLabel}>
                                <span style={{ color: "#b91c1c" }}>❌ Wrong Answers</span>
                                <span style={{ color: "#b91c1c" }}>{wrong}/{questions.length}</span>
                            </div>
                            <div style={s.fbTrack}>
                                <div style={{ ...s.fbFill, width: `${wrongPct}%`, backgroundColor: "#ef4444" }} />
                            </div>
                        </div>

                        <div style={s.feedbackBar}>
                            <div style={s.fbLabel}>
                                <span style={{ color: "#1d4ed8" }}>🎯 Overall Score</span>
                                <span style={{ color: scoreColor }}>{pct}%</span>
                            </div>
                            <div style={s.fbTrack}>
                                <div style={{ ...s.fbFill, width: `${pct}%`, backgroundColor: scoreColor }} />
                            </div>
                        </div>
                    </div>

                    {/* ── Answer Review ── */}
                    <div style={s.reviewBox}>
                        <div style={s.reviewHead}>📝 Answer Review</div>
                        {questions.map((q, i) => {
                            const ua      = userAnswers[i];
                            const correct = ua?.correct;
                            return (
                                <div key={i} style={s.reviewRow}>
                                    <div style={{
                                        ...s.reviewNum,
                                        backgroundColor: correct ? "#dcfce7" : "#fee2e2",
                                        color: correct ? "#15803d" : "#b91c1c",
                                    }}>
                                        {correct ? "✓" : "✗"}
                                    </div>
                                    <div>
                                        <p style={s.reviewQ}>{i + 1}. {q.q}</p>
                                        <p style={s.reviewAns}>
                                            Your answer: <strong style={{ color: correct ? "#15803d" : "#b91c1c" }}>
                                                {ua?.label}. {q.options["ABCD".indexOf(ua?.label)]}
                                            </strong>
                                            {!correct && (
                                                <span style={{ color: "#15803d", marginLeft: "8px" }}>
                                                    · Correct: <strong>{q.answer}. {q.options["ABCD".indexOf(q.answer)]}</strong>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Buttons ── */}
                    <div style={s.resultBtns}>
                        <button style={s.retryBtn} onClick={handleRetry}>🔄 Try Another Topic</button>
                        <button style={s.dashBtn}  onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
                    </div>

                </div>
            </div>
        );
    }

    // ── QUIZ LOADING SCREEN ──
    if (quizStarted && questions.length === 0) return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
            </nav>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <div className="spinner" />
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#64748b" }}>Loading questions...</p>
            </div>
        </div>
    );

    // ── QUIZ ENGINE SCREEN ──
    if (quizStarted) {
        const q        = questions[current];
        const progress = ((current + 1) / questions.length) * 100;
        const answered_count = current + (answered ? 1 : 0);
        return (
            <div style={s.screen}>
                <nav style={s.navbar}>
                    <span style={s.brand}>• Interview System — {TOPICS[topicIdx].name}</span>
                    <button style={s.backBtn} onClick={handleRetry}>✕ Exit Quiz</button>
                </nav>
                <main style={s.main} className="page-enter">
                    <div style={s.quizWrap}>

                        {/* ── Progress Header ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={s.qMeta}>
                                <span style={s.qNumber}>📝 Question {current + 1} of {questions.length}</span>
                                <span style={s.qTimer}>✅ {score} correct</span>
                            </div>

                            {/* Progress bar */}
                            <div style={s.progressBar}>
                                <div className="progress-active" style={{ ...s.progressFill, width: `${progress}%` }} />
                            </div>

                            {/* Step dots */}
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {questions.map((_, i) => {
                                    const ua = userAnswers[i];
                                    const bg = i < current
                                        ? (ua?.correct ? "#22c55e" : "#ef4444")
                                        : i === current ? "#3b82f6" : "#e2e8f0";
                                    return (
                                        <div key={i} style={{
                                            width: "10px", height: "10px", borderRadius: "50%",
                                            backgroundColor: bg,
                                            transition: "background-color 0.3s ease",
                                            flexShrink: 0,
                                        }} />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Question */}
                        <p style={s.qText} className="slide-enter">{current + 1}. {q.q}</p>

                        {/* Options */}
                        <div style={s.optionsGrid} className="options-grid">
                            {q.options.map((opt, i) => {
                                const label = OPTION_LABELS[i];
                                const c = getOptionStyle(s.optionBtn, label, selected, answered, q.answer);
                                return (
                                    <button
                                        key={label}
                                        className="option-btn"
                                        style={{ ...s.optionBtn, borderColor: c.border, backgroundColor: c.bg, color: c.color }}
                                        onClick={() => handleSelect(label)}
                                        disabled={answered}
                                    >
                                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: c.border, color: c.color === "#1e293b" ? "#64748b" : c.color, fontSize: "12px", fontWeight: "700", marginRight: "10px", flexShrink: 0, border: `1.5px solid ${c.border}` }}>
                                            {label}
                                        </span>
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feedback + Next */}
                        {answered && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fadeInUp 0.25s ease both" }}>
                                <span style={{ fontSize: "14px", fontWeight: "600", color: selected === q.answer ? "#15803d" : "#b91c1c", backgroundColor: selected === q.answer ? "#dcfce7" : "#fee2e2", padding: "8px 14px", borderRadius: "8px" }}>
                                    {selected === q.answer ? "✅ Correct!" : `❌ Wrong! Correct: ${q.answer}`}
                                </span>
                                <button style={s.nextBtn} onClick={handleNext}>
                                    {current + 1 === questions.length ? "See Results →" : "Next →"}
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    // ── TOPIC SELECTION SCREEN ──
    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
            </nav>
            <main style={s.main} className="page-enter">

                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1e293b", margin: "0 0 4px" }}>🧠 Start Quiz</h1>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Choose a topic and test your knowledge</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <p style={s.sectionLabel}>📚 Select a Topic</p>
                    <div style={s.topicGrid} className="topic-grid">
                        {TOPICS.map((topic, i) => (
                            <div
                                key={topic.name}
                                className="card-enter"
                                style={{
                                    ...s.topicCard,
                                    borderColor: topicIdx === i ? topic.accent : hovered === i ? topic.accent : "#e2e8f0",
                                    backgroundColor: topicIdx === i ? topic.iconBg : "#ffffff",
                                    transform: hovered === i ? "translateY(-4px) scale(1.01)" : "none",
                                    boxShadow: topicIdx === i || hovered === i ? "0 8px 24px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.07)",
                                }}
                                onClick={() => setTopicIdx(i)}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <div style={{ ...s.topicIconWrap, backgroundColor: topic.iconBg }}>{topic.icon}</div>
                                <p style={{ ...s.topicName, color: topicIdx === i ? topic.accent : "#1e293b" }}>{topic.name}</p>
                                <div style={s.topicMeta}>
                                    <span style={s.topicQCount}>📝 {QUESTION_BANK[topic.name].length} questions</span>
                                    <span style={{ ...s.diffBadge, backgroundColor: topic.diff.bg, color: topic.diff.color }}>{topic.difficulty}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {topicIdx !== null && (
                    <div style={{ backgroundColor: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "10px", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <p style={{ fontSize: "14px", fontWeight: "700", color: "#1d4ed8", margin: 0 }}>✅ Selected: {TOPICS[topicIdx].name}</p>
                            <p style={{ fontSize: "12px", color: "#3b82f6", margin: 0 }}>{QUESTION_BANK[TOPICS[topicIdx].name].length} questions · {TOPICS[topicIdx].difficulty} difficulty</p>
                        </div>
                        <span style={{ fontSize: "22px" }}>{TOPICS[topicIdx].icon}</span>
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        style={topicIdx !== null ? s.startBtn : s.startBtnOff}
                        disabled={topicIdx === null}
                        onClick={handleStartQuiz}
                    >
                        {topicIdx === null ? "Select a topic to begin" : `Start ${TOPICS[topicIdx].name} Quiz →`}
                    </button>
                </div>

            </main>
        </div>
    );
}

export default Quiz;
