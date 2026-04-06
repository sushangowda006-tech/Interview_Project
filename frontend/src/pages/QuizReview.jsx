import { useLocation, useNavigate } from "react-router-dom";

// Explanations for every question in every topic
const EXPLANATIONS = {
    "Java OOP": [
        "Encapsulation hides internal data using private fields and public getters/setters — a core OOP principle.",
        "'extends' is the Java keyword for class inheritance. 'implements' is used for interfaces.",
        "Polymorphism means one interface, many implementations — e.g., method overriding across subclasses.",
        "A 'final' class cannot be subclassed/extended, preventing inheritance.",
        "Method overriding is runtime polymorphism — a subclass provides its own implementation of a parent method.",
        "An abstract class cannot be instantiated directly; it must be subclassed.",
        "'super' refers to the parent class — used to call parent constructors or methods.",
        "Java doesn't support multiple class inheritance, but a class can implement multiple interfaces.",
        "A constructor is a special method called automatically when an object is created.",
        "Method overloading = same name, different parameter lists (type or count).",
    ],
    "Spring Boot": [
        "@SpringBootApplication combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.",
        "@RestController = @Controller + @ResponseBody, used to build REST APIs.",
        "@Autowired tells Spring to inject the required dependency automatically.",
        "application.properties (or application.yml) is the main Spring Boot config file.",
        "Spring Boot's default embedded server (Tomcat) runs on port 8080.",
        "@GetMapping maps HTTP GET requests to a specific handler method.",
        "@Entity marks a class as a JPA entity mapped to a database table.",
        "@Autowired on a constructor is the recommended way for dependency injection.",
        "Spring Security handles authentication (who are you?) and authorization (what can you do?).",
        "JPA = Java Persistence API — a specification for ORM (Object-Relational Mapping).",
    ],
    "SQL & Databases": [
        "SELECT retrieves data. INSERT adds, UPDATE modifies, DELETE removes rows.",
        "PRIMARY KEY uniquely identifies each row and cannot be NULL or duplicate.",
        "FULL OUTER JOIN returns all rows from both tables, with NULLs where no match exists.",
        "FOREIGN KEY links two tables by referencing the PRIMARY KEY of another table.",
        "TRUNCATE removes all rows quickly without logging individual row deletions. DROP removes the table itself.",
        "GROUP BY groups rows with the same values so aggregate functions can be applied.",
        "COUNT() counts the number of rows. SUM() adds values, AVG() averages them.",
        "Normalization organizes data to reduce redundancy and improve data integrity.",
        "HAVING filters groups after GROUP BY. WHERE filters rows before grouping.",
        "An INDEX speeds up data retrieval by creating a lookup structure on a column.",
    ],
    "React Basics": [
        "JSX is a syntax extension that lets you write HTML-like code inside JavaScript.",
        "useState is the hook for managing local component state in functional components.",
        "useEffect handles side effects like API calls, subscriptions, and DOM manipulation.",
        "A React component is a reusable piece of UI — either a function or class.",
        "Props pass data from parent to child components (one-way data flow).",
        "The key prop helps React identify which list items changed, were added, or removed.",
        "Calling the useState setter function triggers a re-render of the component.",
        "The virtual DOM is a lightweight JS copy of the real DOM — React diffs it to minimize updates.",
        "React Router enables client-side navigation between pages without full page reloads.",
        "useEffect with no dependency array runs after every render.",
    ],
    "REST APIs": [
        "REST = Representational State Transfer — an architectural style for distributed systems.",
        "POST creates a new resource. GET reads, PUT updates, DELETE removes.",
        "404 = Not Found. 200 = OK, 401 = Unauthorized, 500 = Server Error.",
        "200 OK is the standard success response for GET requests.",
        "PUT replaces an existing resource. PATCH partially updates it.",
        "An endpoint is a specific URL path that accepts and responds to HTTP requests.",
        "401 Unauthorized means the request lacks valid authentication credentials.",
        "REST APIs commonly use JSON (JavaScript Object Notation) for data exchange.",
        "CORS = Cross-Origin Resource Sharing — controls which origins can access your API.",
        "DELETE removes a resource. It's idempotent — calling it multiple times has the same effect.",
    ],
    "Security & JWT": [
        "JWT = JSON Web Token — a compact, URL-safe token for transmitting claims between parties.",
        "A JWT has 3 parts: Header.Payload.Signature, separated by dots.",
        "BCrypt is a password hashing algorithm designed to be slow, making brute-force attacks harder.",
        "JWT is sent in the Authorization header as 'Bearer <token>'.",
        "The signature verifies the token hasn't been tampered with using a secret key.",
        "HTTPS = HTTP + SSL/TLS encryption, securing data in transit.",
        "SQL Injection inserts malicious SQL into queries to manipulate the database.",
        "@PreAuthorize checks method-level security before the method executes.",
        "XSS (Cross-Site Scripting) injects malicious scripts into web pages viewed by other users.",
        "A Refresh Token is a long-lived token used to get a new access token without re-login.",
    ],
};

const s = {
    screen:   { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:   { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:    { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn:  { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:     { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px", width: "100%", margin: "0 auto", paddingBottom: "48px" },
    header:   { display: "flex", alignItems: "center", gap: "14px" },
    iconWrap: { width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" },
    title:    { fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 },
    subtitle: { fontSize: "14px", color: "#64748b", margin: 0 },
    qCard:    { backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px 28px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "14px" },
    qHeader:  { display: "flex", alignItems: "center", gap: "12px" },
    qNum:     { width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
    qText:    { fontSize: "15px", fontWeight: "700", color: "#1e293b", flex: 1 },
    optionRow:{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", fontSize: "13px" },
    optLabel: { width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 },
    explain:  { backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#1d4ed8", lineHeight: 1.6 },
    btns:     { display: "flex", gap: "14px", justifyContent: "center", paddingTop: "8px" },
    btn:      { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
    btnGhost: { backgroundColor: "transparent", color: "#64748b", border: "1.5px solid #e2e8f0", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
};

const OPTION_LABELS = ["A", "B", "C", "D"];

function QuizReview() {
    const navigate  = useNavigate();
    const { state } = useLocation();

    // Expects: { questions, userAnswers, topic }
    if (!state?.questions) {
        return (
            <div style={s.screen}>
                <nav style={s.navbar}>
                    <span style={s.brand}>• Interview System</span>
                    <button style={s.backBtn} onClick={() => navigate("/quiz")}>← Back to Quiz</button>
                </nav>
                <main style={{ ...s.main, alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#64748b", fontSize: "16px" }}>No review data. Please complete a quiz first.</p>
                    <button style={s.btn} onClick={() => navigate("/quiz")}>🧠 Take a Quiz</button>
                </main>
            </div>
        );
    }

    const { questions, userAnswers, topic } = state;
    const correct = userAnswers.filter(a => a.correct).length;
    const explanations = EXPLANATIONS[topic] || [];

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System — Review Mode</span>
                <button style={s.backBtn} onClick={() => navigate("/quiz")}>← New Quiz</button>
            </nav>

            <main style={s.main} className="page-enter">

                <div style={s.header}>
                    <div style={s.iconWrap}>📖</div>
                    <div>
                        <h1 style={s.title}>Quiz Review — {topic}</h1>
                        <p style={s.subtitle}>{correct}/{questions.length} correct · Learn from your mistakes below</p>
                    </div>
                </div>

                {questions.map((q, i) => {
                    const ua      = userAnswers[i];
                    const isRight = ua?.correct;
                    const explain = explanations[i] || "Review the concept for this question.";

                    return (
                        <div key={i} style={{
                            ...s.qCard,
                            borderColor: isRight ? "#bbf7d0" : "#fecaca",
                            borderLeftWidth: "4px",
                            borderLeftColor: isRight ? "#22c55e" : "#ef4444",
                        }}>
                            {/* Question header */}
                            <div style={s.qHeader}>
                                <div style={{ ...s.qNum, backgroundColor: isRight ? "#dcfce7" : "#fee2e2", color: isRight ? "#15803d" : "#b91c1c" }}>
                                    {isRight ? "✓" : "✗"}
                                </div>
                                <p style={s.qText}>{i + 1}. {q.q}</p>
                            </div>

                            {/* Options */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {q.options.map((opt, oi) => {
                                    const label     = OPTION_LABELS[oi];
                                    const isCorrect = label === q.answer;
                                    const isUser    = label === ua?.label;
                                    const bg = isCorrect ? "#dcfce7" : isUser && !isCorrect ? "#fee2e2" : "#f8fafc";
                                    const color = isCorrect ? "#15803d" : isUser && !isCorrect ? "#b91c1c" : "#64748b";
                                    const labelBg = isCorrect ? "#22c55e" : isUser && !isCorrect ? "#ef4444" : "#e2e8f0";
                                    const labelColor = isCorrect || (isUser && !isCorrect) ? "#fff" : "#64748b";
                                    return (
                                        <div key={label} style={{ ...s.optionRow, backgroundColor: bg }}>
                                            <div style={{ ...s.optLabel, backgroundColor: labelBg, color: labelColor }}>{label}</div>
                                            <span style={{ fontSize: "13px", color, fontWeight: isCorrect ? "600" : "400" }}>
                                                {opt}
                                                {isCorrect && " ✅"}
                                                {isUser && !isCorrect && " ← Your answer"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            <div style={s.explain}>
                                💡 <strong>Explanation:</strong> {explain}
                            </div>
                        </div>
                    );
                })}

                <div style={s.btns}>
                    <button style={s.btn} onClick={() => navigate("/quiz")}>🔄 Try Another Quiz</button>
                    <button style={s.btnGhost} onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
                </div>

            </main>
        </div>
    );
}

export default QuizReview;
