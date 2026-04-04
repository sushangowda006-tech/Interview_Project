import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";

// ── Validates token exists AND is not expired ──
function isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        return exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

function getRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try { return JSON.parse(atob(token.split(".")[1])).role; } catch { return null; }
}

// ── Protects user routes ──
const Protected = ({ children }) => {
    if (!isAuthenticated()) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
    return children;
};

// ── Protects admin routes ──
const AdminOnly = ({ children }) => {
    if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;
    if (getRole() !== "ADMIN") return <Navigate to="/dashboard" replace />;
    return children;
};

// ── Redirects logged-in users away from public pages ──
const PublicOnly = ({ children }) => {
    if (!isAuthenticated()) return children;
    return <Navigate to={getRole() === "ADMIN" ? "/admin" : "/dashboard"} replace />;
};

function App() {
    return (
        <Routes>
            <Route path="/"            element={<PublicOnly><Landing /></PublicOnly>} />
            <Route path="/login"       element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/register"    element={<PublicOnly><Register /></PublicOnly>} />
            <Route path="/dashboard"   element={<Protected><Dashboard /></Protected>} />
            <Route path="/quiz"        element={<Protected><Quiz /></Protected>} />
            <Route path="/results"     element={<Protected><Results /></Protected>} />
            <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
            <Route path="/admin/login"  element={<PublicOnly><AdminLogin /></PublicOnly>} />
            <Route path="/admin"        element={<AdminOnly><AdminDashboard /></AdminOnly>} />
            <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;