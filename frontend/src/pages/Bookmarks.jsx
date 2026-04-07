import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../utils/toast";

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = {
    default:  { border: "#e2e8f0", bg: "#f8fafc",  color: "#1e293b" },
    selected: { border: "#3b82f6", bg: "#eff6ff",  color: "#1d4ed8" },
    correct:  { border: "#22c55e", bg: "#dcfce7",  color: "#15803d" },
    wrong:    { border: "#ef4444", bg: "#fee2e2",  color: "#b91c1c" },
};

const s = {
    screen:   { display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },
    navbar:   { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#1e293b", padding: "0 32px", height: "64px", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", position: "sticky", top: 0, zIndex: 100 },
    brand:    { color: "#f8fafc", fontSize: "18px", fontWeight: "700" },
    backBtn:  { backgroundColor: "transparent", color: "#94a3b8", border: "1.5px solid #334155", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    main:     { flex: 1, padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "860px", width: "100%", margin: "0 auto", paddingBottom: "48px" },
    header:   { display: "flex", alignItems: "center", justifyContent: "space-between" },
    titleWrap:{ display: "flex", alignItems: "center", gap: "14px" },
    iconWrap: { width: "52px", height: "52px", borderRadius: "12px", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" },
    title:    { fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 },
    subtitle: { fontSize: "14px", color: "#64748b", margin: 0 },
    clearBtn: { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
    practiceBtn:{ backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" },
    qCard:    { backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px 28px", border: "1.5px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "14px" },
    qHeader:  { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" },
    qText:    { fontSize: "15px", fontWeight: "700", color: "#1e293b", flex: 1 },
    topicTag: { fontSize: "11px", color: "#64748b", backgroundColor: "#f1f5f9", padding: "3px 10px", borderRadius: "99px", whiteSpace: "nowrap", flexShrink: 0 },
    removeBtn:{ backgroundColor: "transparent", border: "none", cursor: "pointer", fontSize: "16px", color: "#94a3b8", padding: 0, flexShrink: 0 },
    optionRow:{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid", cursor: "pointer", fontSize: "13px", transition: "all 0.15s ease" },
    optLabel: { width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 },
    feedback: { fontSize: "13px", fontWeight: "600", padding: "8px 14px", borderRadius: "8px" },
    emptyWrap:{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "64px 32px", textAlign: "center", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
    quizBtn:  { backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: "700", fontSize: "14px", cursor: "pointer", marginTop: "8px" },
};

function Bookmarks() {
    const navigate = useNavigate();
    const toast    = useToast();
    const [bookmarks, setBookmarks] = useState([]);
    const [answers,   setAnswers]   = useState({}); // qIdx -> selected label
    const [revealed,  setRevealed]  = useState({}); // qIdx -> bool

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        setBookmarks(saved);
    }, []);

    const save = (updated) => {
        setBookmarks(updated);
        localStorage.setItem("bookmarks", JSON.stringify(updated));
    };

    const removeBookmark = (idx) => {
        const updated = bookmarks.filter((_, i) => i !== idx);
        save(updated);
        toast("Bookmark removed", "info");
    };

    const clearAll = () => {
        save([]);
        setAnswers({});
        setRevealed({});
        toast("All bookmarks cleared", "warning");
    };

    const handleSelect = (qIdx, label) => {
        if (revealed[qIdx]) return;
        setAnswers(prev => ({ ...prev, [qIdx]: label }));
        setRevealed(prev => ({ ...prev, [qIdx]: true }));
        const correct = label === bookmarks[qIdx].answer;
        toast(correct ? "✅ Correct!" : `❌ Wrong! Answer: ${bookmarks[qIdx].answer}`, correct ? "success" : "error", 2000);
        if (correct) {
            setTimeout(() => removeBookmark(qIdx), 1500);
        }
    };

    if (bookmarks.length === 0) return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>
            <main style={s.main} className="page-enter">
                <div style={s.emptyWrap}>
                    <span style={{ fontSize: "56px" }}>🔖</span>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 }}>No bookmarks yet</h2>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Questions you get wrong will be saved here for practice.</p>
                    <button style={s.quizBtn} onClick={() => navigate("/quiz")}>🧠 Take a Quiz</button>
                </div>
            </main>
        </div>
    );

    return (
        <div style={s.screen}>
            <nav style={s.navbar}>
                <span style={s.brand}>• Interview System</span>
                <button style={s.backBtn} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            </nav>
            <main style={s.main} className="page-enter">

                <div style={s.header}>
                    <div style={s.titleWrap}>
                        <div style={s.iconWrap}>🔖</div>
                        <div>
                            <h1 style={s.title}>Bookmarks</h1>
                            <p style={s.subtitle}>{bookmarks.length} question{bookmarks.length !== 1 ? "s" : ""} to practice · Answer correctly to remove</p>
                        </div>
                    </div>
                    <button style={s.clearBtn} onClick={clearAll}>🗑️ Clear All</button>
                </div>

                {bookmarks.map((bm, qIdx) => {
                    const sel = answers[qIdx];
                    const rev = revealed[qIdx];
                    return (
                        <div key={qIdx} style={s.qCard} className="card-enter">
                            <div style={s.qHeader}>
                                <p style={s.qText}>{qIdx + 1}. {bm.q}</p>
                                <span style={s.topicTag}>{bm.topic}</span>
                                <button style={s.removeBtn} onClick={() => removeBookmark(qIdx)} title="Remove bookmark">✕</button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {bm.options.map((opt, oi) => {
                                    const label = OPTION_LABELS[oi];
                                    let c = OPTION_COLORS.default;
                                    if (rev) {
                                        if (label === bm.answer) c = OPTION_COLORS.correct;
                                        else if (label === sel)  c = OPTION_COLORS.wrong;
                                    } else if (label === sel) {
                                        c = OPTION_COLORS.selected;
                                    }
                                    return (
                                        <div key={label} style={{ ...s.optionRow, borderColor: c.border, backgroundColor: c.bg, color: c.color }}
                                            onClick={() => handleSelect(qIdx, label)}>
                                            <div style={{ ...s.optLabel, backgroundColor: c.border, color: c.color === "#1e293b" ? "#64748b" : c.color }}>
                                                {label}
                                            </div>
                                            {opt}
                                            {rev && label === bm.answer && " ✅"}
                                        </div>
                                    );
                                })}
                            </div>

                            {rev && (
                                <div style={{ ...s.feedback, backgroundColor: sel === bm.answer ? "#dcfce7" : "#fee2e2", color: sel === bm.answer ? "#15803d" : "#b91c1c" }}>
                                    {sel === bm.answer ? "✅ Correct! This will be removed from bookmarks." : `❌ Wrong. Correct answer: ${bm.answer}. Keep practicing!`}
                                </div>
                            )}
                        </div>
                    );
                })}
            </main>
        </div>
    );
}

export default Bookmarks;
