import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { getErrorMessage } from "../utils/errorHandler";

const s = {
    screen: {
        display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #0f172a 0%, #2e1065 100%)",
    },
    left: {
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px", color: "#fff",
    },
    leftBrand:    { fontSize: "22px", fontWeight: "800", color: "#c084fc", marginBottom: "48px", display: "flex", alignItems: "center", gap: "8px" },
    leftDot:      { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#a855f7", display: "inline-block" },
    leftTitle:    { fontSize: "40px", fontWeight: "900", lineHeight: 1.2, margin: "0 0 16px" },
    leftSub:      { fontSize: "16px", color: "#94a3b8", margin: 0, lineHeight: 1.6 },
    leftFeatures: { marginTop: "40px", display: "flex", flexDirection: "column", gap: "14px" },
    feature:      { display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#cbd5e1" },
    featureIcon:  { width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },

    right: {
        width: "480px", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px", backgroundColor: "#f8fafc",
    },
    card: {
        width: "100%", backgroundColor: "#ffffff", borderRadius: "20px",
        padding: "44px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    },
    adminBadge:  { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f3e8ff", color: "#7c3aed", fontSize: "12px", fontWeight: "700", padding: "5px 12px", borderRadius: "99px", marginBottom: "16px", letterSpacing: "0.5px" },
    cardTitle:   { fontSize: "26px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px" },
    cardSub:     { fontSize: "14px", color: "#64748b", margin: "0 0 28px" },

    label:       { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" },
    inputWrap:   { position: "relative", marginBottom: "18px" },
    input:       { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box", color: "#1e293b", backgroundColor: "#f8fafc", transition: "border-color 0.2s" },
    eyeBtn:      { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8", padding: 0 },

    errorBox:    { backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "flex-start", gap: "8px" },
    successBox:  { backgroundColor: "#f5f3ff", border: "1px solid #ddd6fe", color: "#6d28d9", padding: "12px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" },
    roleError:   { backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "18px" },

    btn:         { width: "100%", padding: "14px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
    btnDisabled: { width: "100%", padding: "14px", backgroundColor: "#c4b5fd", color: "#fff", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },

    divider:     { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0", color: "#94a3b8", fontSize: "13px" },
    dividerLine: { flex: 1, height: "1px", backgroundColor: "#e2e8f0" },
    footer:      { textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "20px" },
    link:        { color: "#7c3aed", fontWeight: "600", textDecoration: "none" },
};

const FEATURES = [
    { icon: "📝", text: "Add, edit and delete quiz questions" },
    { icon: "👥", text: "View all registered users" },
    { icon: "📊", text: "Monitor user results and performance" },
];

function AdminLogin() {
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [showPwd,  setShowPwd]  = useState(false);
    const [error,    setError]    = useState("");
    const [success,  setSuccess]  = useState("");
    const [loading,  setLoading]  = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");

        if (!email.trim())    return setError("❌ Please enter your email.");
        if (!password.trim()) return setError("❌ Please enter your password.");

        setLoading(true);
        try {
            const res   = await API.post("/auth/login", { email, password });
            const token = res.data.token;
            const { role } = JSON.parse(atob(token.split(".")[1]));

            if (role !== "ADMIN") {
                setError("🚫 Access denied. This portal is for admins only.");
                return;
            }

            localStorage.setItem("token", token);
            setSuccess("✅ Admin login successful! Redirecting...");
            setTimeout(() => navigate("/admin"), 900);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.screen} className="auth-screen">

            {/* Left Panel */}
            <div style={s.left} className="auth-left">
                <div style={s.leftBrand}>
                    <span style={s.leftDot} /> Interview System
                </div>
                <h1 style={s.leftTitle}>Manage.<br />Monitor.<br />Control.</h1>
                <p style={s.leftSub}>The admin portal for managing the interview quiz platform.</p>
                <div style={s.leftFeatures}>
                    {FEATURES.map(f => (
                        <div key={f.text} style={s.feature}>
                            <div style={s.featureIcon}>{f.icon}</div>
                            {f.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div style={s.right} className="auth-right">
                <div style={s.card} className="page-enter auth-card">
                    <div style={s.adminBadge}>🛠️ Admin Portal</div>
                    <h2 style={s.cardTitle}>Admin Sign In</h2>
                    <p style={s.cardSub}>Restricted access — admins only</p>

                    {error   && <div style={s.errorBox}><span>⚠️</span><span>{error}</span></div>}
                    {success && <div style={s.successBox}>{success}</div>}

                    <form onSubmit={handleLogin}>
                        <label style={s.label}>Admin Email</label>
                        <div style={s.inputWrap}>
                            <input style={s.input} type="email" placeholder="admin@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <label style={s.label}>Password</label>
                        <div style={s.inputWrap}>
                            <input style={{ ...s.input, paddingRight: "44px" }}
                                type={showPwd ? "text" : "password"} placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)} required />
                            <button type="button" style={s.eyeBtn} onClick={() => setShowPwd(p => !p)}>
                                {showPwd ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <button type="submit" style={loading ? s.btnDisabled : s.btn} disabled={loading}>
                            {loading ? <><span className="spinner-sm" /> Signing in...</> : "🛠️ Admin Sign In →"}
                        </button>
                    </form>

                    <div style={s.divider}>
                        <div style={s.dividerLine} /> or <div style={s.dividerLine} />
                    </div>

                    <p style={s.footer}>
                        Not an admin?{" "}
                        <Link to="/login" style={s.link}>User Login →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
