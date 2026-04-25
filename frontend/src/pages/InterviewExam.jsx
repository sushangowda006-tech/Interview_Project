import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const s = {
    screen:   { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:   { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:    { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn:  { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:     { flex: 1, padding: "40px 32px", maxWidth: "860px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },

    card:     { backgroundColor: "#fff", borderRadius: "16px", padding: "32px", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" },
    qNum:     { fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" },
    qText:    { fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "20px", lineHeight: 1.5 },
    optGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    optBtn:   { padding: "13px 16px", borderRadius: "10px", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "14px", fontWeight: "500", cursor: "pointer", textAlign: "left", color: "#1e293b", transition: "all 0.15s" },
    optSel:   { padding: "13px 16px", borderRadius: "10px", border: "2px solid #3b82f6", backgroundColor: "#eff6ff", fontSize: "14px", fontWeight: "600", cursor: "pointer", textAlign: "left", color: "#1d4ed8", transition: "all 0.15s" },

    progress: { height: "6px", backgroundColor: "#e2e8f0", borderRadius: "99px", overflow: "hidden" },
    progFill: { height: "100%", backgroundColor: "#3b82f6", borderRadius: "99px", transition: "width 0.4s ease" },

    submitBtn:  { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "14px 40px", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,0.35)" },
    disabledBtn:{ backgroundColor: "#cbd5e1", color: "#fff", border: "none", padding: "14px 40px", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "not-allowed" },

    // Result screen
    resultHero: { background: "linear-gradient(135deg, #1e293b 0%, #1d4ed8 100%)", borderRadius: "20px", padding: "48px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    statsRow:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
    statBox:    { backgroundColor: "#fff", borderRadius: "14px", padding: "24px", textAlign: "center", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },

    emptyBox:   { textAlign: "center", padding: "80px 32px", color: "#94a3b8", fontSize: "16px" },
    spinner:    { textAlign: "center", padding: "80px 32px", color: "#94a3b8", fontSize: "15px" },
};

const LABELS = ["A", "B", "C", "D"];

function InterviewExam() {
    const navigate = useNavigate();
    const [questions, setQuestions]   = useState([]);
    const [answers,   setAnswers]     = useState({});
    const [loading,   setLoading]     = useState(true);
    const [submitting,setSubmitting]  = useState(false);
    const [result,    setResult]      = useState(null);
    const [error,     setError]       = useState("");

    useEffect(() => {
        API.get("/questions")
            .then(res => { setQuestions(res.data); setLoading(false); })
            .catch(() => { setError("Failed to load questions."); setLoading(false); });
    }, []);

    const handleSelect = (qId, label) => {
        if (result) return;
        setAnswers(prev => ({ ...prev, [qId]: label }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }
        setSubmitting(true);
        try {
            // Calculate score on frontend
            let score = 0;
            questions.forEach(q => {
                if (answers[q.id] === q.correctAnswer) score++;
            });
            const pct = Math.round((score / questions.length) * 100);

            await API.post("/results/submit", {
                answers,
                topic: "Interview Exam",
                score,
                totalQuestions: questions.length,
                percentage: pct,
            });

            setResult({ score, total: questions.length, pct });
        } catch (err) {
            setError("Failed to submit. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const answeredCount = Object.keys(answers).length;
    const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

    // ── Result Screen ──
    if (result) {
        const { score, total, pct } = result;
        const scoreColor = pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
        const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 60 ? "C" : "D";
        const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪";

        return (
            <div style={s.screen}>
                <nav style={s.navbar}>
                    <span style={s.brand}>• Interview System</span>
                    <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
                </nav>
                <div style={{ ...s.main, alignItems: "stretch" }} className="page-enter">
                    <div style={s.resultHero}>
                        <span style={{ fontSize: "64px" }}>{emoji}</span>
                        <p style={{ fontSize: "64px", fontWeight: "900", color: scoreColor, margin: 0, lineHeight: 1 }}>{pct}%</p>
                        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>
                            {pct >= 75 ? "Great Job! You Passed! 🎉" : "Keep Practicing! 💪"}
                        </h2>
                        <p style={{ fontSize: "14px", color: "#cbd5e1", margin: 0 }}>Interview Exam — {total} Questions</p>
                    </div>

                    <div style={s.statsRow}>
                        <div style={s.statBox}>
                            <div style={{ fontSize: "28px" }}>✅</div>
                            <div style={{ fontSize: "28px", fontWeight: "900", color: "#22c55e" }}>{score}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Correct</div>
                        </div>
                        <div style={s.statBox}>
                            <div style={{ fontSize: "28px" }}>❌</div>
                            <div style={{ fontSize: "28px", fontWeight: "900", color: "#ef4444" }}>{total - score}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Wrong</div>
                        </div>
                        <div style={s.statBox}>
                            <div style={{ fontSize: "28px" }}>🎓</div>
                            <div style={{ fontSize: "28px", fontWeight: "900", color: scoreColor }}>Grade {grade}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Out of {total} Qs</div>
                        </div>
                    </div>

                    {/* Answer Review */}
                    <div style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
                        <div style={{ padding: "16px 24px", backgroundColor: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
                            📝 Answer Review
                        </div>
                        {questions.map((q, i) => {
                            const userAns = answers[q.id];
                            const correct = userAns === q.correctAnswer;
                            const opts = [q.optionA, q.optionB, q.optionC, q.optionD];
                            return (
                                <div key={q.id} style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: correct ? "#dcfce7" : "#fee2e2", color: correct ? "#15803d" : "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", flexShrink: 0 }}>
                                        {correct ? "✓" : "✗"}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b", margin: "0 0 4px" }}>{i + 1}. {q.questionTitle}</p>
                                        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                                            Your answer: <strong style={{ color: correct ? "#15803d" : "#b91c1c" }}>{userAns}. {opts[LABELS.indexOf(userAns)]}</strong>
                                            {!correct && <span style={{ color: "#15803d", marginLeft: "8px" }}>· Correct: <strong>{q.correctAnswer}. {opts[LABELS.indexOf(q.correctAnswer)]}</strong></span>}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: "flex", gap: "14px", justifyContent: "center", paddingBottom: "32px" }}>
                        <button style={s.submitBtn} onClick={() => { setResult(null); setAnswers({}); }}>🔄 Retake Exam</button>
                        <button style={{ ...s.submitBtn, backgroundColor: "#64748b", boxShadow: "none" }} onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System — Interview Exam</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>

            <div style={s.main} className="page-enter">
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#1e293b", margin: "0 0 4px" }}>📋 Interview Exam</h1>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Answer all questions set by the admin and submit when ready.</p>
                </div>

                {error && <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 16px", borderRadius: "10px", fontSize: "13px" }}>{error}</div>}

                {loading ? (
                    <div style={s.spinner}>Loading questions...</div>
                ) : questions.length === 0 ? (
                    <div style={s.emptyBox}>
                        <p style={{ fontSize: "48px", margin: "0 0 16px" }}>📭</p>
                        <p style={{ fontWeight: "700", color: "#1e293b", fontSize: "18px", margin: "0 0 8px" }}>No questions available yet</p>
                        <p style={{ margin: 0 }}>The admin hasn't added any questions. Check back later.</p>
                    </div>
                ) : (
                    <>
                        {/* Progress bar */}
                        <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "16px 20px", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                                <span>Progress</span>
                                <span>{answeredCount} / {questions.length} answered</span>
                            </div>
                            <div style={s.progress}>
                                <div style={{ ...s.progFill, width: `${progress}%` }} />
                            </div>
                        </div>

                        {/* Questions */}
                        {questions.map((q, i) => {
                            const opts = [q.optionA, q.optionB, q.optionC, q.optionD];
                            return (
                                <div key={q.id} style={s.card}>
                                    <p style={s.qNum}>Question {i + 1} of {questions.length} {q.topic ? `· ${q.topic}` : ""}</p>
                                    <p style={s.qText}>{q.questionTitle}</p>
                                    <div style={s.optGrid}>
                                        {opts.map((opt, j) => {
                                            const label = LABELS[j];
                                            const selected = answers[q.id] === label;
                                            return (
                                                <button key={label} style={selected ? s.optSel : s.optBtn} onClick={() => handleSelect(q.id, label)}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "22px", height: "22px", borderRadius: "50%", backgroundColor: selected ? "#3b82f6" : "#e2e8f0", color: selected ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "700", marginRight: "10px", flexShrink: 0 }}>
                                                        {label}
                                                    </span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Submit */}
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "32px" }}>
                            <button
                                style={answeredCount === questions.length ? s.submitBtn : s.disabledBtn}
                                onClick={handleSubmit}
                                disabled={submitting || answeredCount < questions.length}
                            >
                                {submitting ? "Submitting..." : `Submit Exam (${answeredCount}/${questions.length} answered)`}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default InterviewExam;
