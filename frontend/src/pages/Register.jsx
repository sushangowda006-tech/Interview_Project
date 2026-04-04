import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { getErrorMessage } from "../utils/errorHandler";

const s = {
    screen:      { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)" },
    left:        { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", color: "#fff" },
    leftBrand:   { fontSize: "22px", fontWeight: "800", color: "#60a5fa", marginBottom: "48px", display: "flex", alignItems: "center", gap: "8px" },
    leftDot:     { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block" },
    leftTitle:   { fontSize: "40px", fontWeight: "900", lineHeight: 1.2, margin: "0 0 16px" },
    leftSub:     { fontSize: "16px", color: "#94a3b8", margin: 0, lineHeight: 1.6 },
    leftSteps:   { marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" },
    step:        { display: "flex", alignItems: "center", gap: "14px" },
    stepNum:     { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(59,130,246,0.25)", border: "1.5px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "#60a5fa", flexShrink: 0 },
    stepText:    { fontSize: "14px", color: "#cbd5e1" },

    right:       { width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", backgroundColor: "#f8fafc" },
    card:        { width: "100%", backgroundColor: "#ffffff", borderRadius: "20px", padding: "44px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" },
    cardTitle:   { fontSize: "26px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" },
    cardSub:     { fontSize: "14px", color: "#64748b", margin: "0 0 28px" },

    label:       { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
    inputWrap:   { position: "relative", marginBottom: "18px" },
    input:       { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box", color: "#1e293b", backgroundColor: "#f8fafc" },
    eyeBtn:      { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8", padding: 0 },

    errorBox:    { backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "flex-start", gap: "8px" },
    successBox:  { backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "12px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" },

    // Password strength
    strengthWrap:{ marginTop: "-10px", marginBottom: "18px" },
    strengthBars:{ display: "flex", gap: "4px", marginBottom: "4px" },
    strengthBar: { flex: 1, height: "4px", borderRadius: "99px", backgroundColor: "#e2e8f0", transition: "background 0.3s" },
    strengthText:{ fontSize: "11px", fontWeight: "600" },

    btn:         { width: "100%", padding: "14px", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
    btnDisabled: { width: "100%", padding: "14px", backgroundColor: "#86efac", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },

    divider:     { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0", color: "#94a3b8", fontSize: "13px" },
    dividerLine: { flex: 1, height: "1px", backgroundColor: "#e2e8f0" },
    footer:      { textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "20px" },
    link:        { color: "#3b82f6", fontWeight: "600", textDecoration: "none" },
};

const STEPS = [
    { num: "1", text: "Create your free account" },
    { num: "2", text: "Choose a quiz topic" },
    { num: "3", text: "Track your progress" },
];

function getStrength(pwd) {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 6)  score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: 1, label: "Weak",   color: "#ef4444" };
    if (score <= 3) return { level: 2, label: "Fair",   color: "#f59e0b" };
    if (score <= 4) return { level: 3, label: "Good",   color: "#3b82f6" };
    return              { level: 4, label: "Strong", color: "#22c55e" };
}

function Register() {
    const [form,    setForm]    = useState({ name: "", email: "", password: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [error,   setError]   = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");

        // Client-side validation
        if (!form.name.trim())              return setError("❌ Please enter your full name.");
        if (!form.email.trim())             return setError("❌ Please enter your email.");
        if (form.password.length < 6)       return setError("❌ Password must be at least 6 characters.");

        setLoading(true);
        try {
            await API.post("/auth/register", form);
            setSuccess("✅ Account created! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const strength = getStrength(form.password);

    return (
        <div style={s.screen} className="auth-screen">
            {/* Left Panel */}
            <div style={s.left} className="auth-left">
                <div style={s.leftBrand}>
                    <span style={s.leftDot} /> Interview System
                </div>
                <h1 style={s.leftTitle}>Start your<br />journey today.</h1>
                <p style={s.leftSub}>Join and start practicing for your dream job interview.</p>
                <div style={s.leftSteps}>
                    {STEPS.map(step => (
                        <div key={step.num} style={s.step}>
                            <div style={s.stepNum}>{step.num}</div>
                            <span style={s.stepText}>{step.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div style={s.right} className="auth-right">
                <div style={s.card} className="page-enter auth-card">
                    <h2 style={s.cardTitle}>Create account 🚀</h2>
                    <p style={s.cardSub}>Free forever. No credit card required.</p>

                    {error   && <div style={s.errorBox}><span>⚠️</span><span>{error}</span></div>}
                    {success && <div style={s.successBox}>{success}</div>}

                    <form onSubmit={handleRegister}>
                        <label style={s.label}>Full Name</label>
                        <div style={s.inputWrap}>
                            <input style={s.input} type="text" name="name" placeholder="John Doe"
                                value={form.name} onChange={handleChange} required />
                        </div>

                        <label style={s.label}>Email address</label>
                        <div style={s.inputWrap}>
                            <input style={s.input} type="email" name="email" placeholder="you@example.com"
                                value={form.email} onChange={handleChange} required />
                        </div>

                        <label style={s.label}>Password</label>
                        <div style={s.inputWrap}>
                            <input style={{ ...s.input, paddingRight: "44px" }}
                                type={showPwd ? "text" : "password"} name="password" placeholder="Min. 6 characters"
                                value={form.password} onChange={handleChange} required />
                            <button type="button" style={s.eyeBtn} onClick={() => setShowPwd(p => !p)}>
                                {showPwd ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {/* Password strength */}
                        {form.password && (
                            <div style={s.strengthWrap}>
                                <div style={s.strengthBars}>
                                    {[1,2,3,4].map(i => (
                                        <div key={i} style={{ ...s.strengthBar, backgroundColor: i <= strength.level ? strength.color : "#e2e8f0" }} />
                                    ))}
                                </div>
                                <span style={{ ...s.strengthText, color: strength.color }}>
                                    Password strength: {strength.label}
                                </span>
                            </div>
                        )}

                        <button type="submit" style={loading ? s.btnDisabled : s.btn} disabled={loading}>
                            {loading ? <><span className="spinner-sm" /> Creating account...</> : "Create Account →"}
                        </button>
                    </form>

                    <div style={s.divider}>
                        <div style={s.dividerLine} /> or <div style={s.dividerLine} />
                    </div>

                    <p style={s.footer}>
                        Already have an account?{" "}
                        <Link to="/login" style={s.link}>Sign in →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
