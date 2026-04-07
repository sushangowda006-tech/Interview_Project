import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

const ICONS = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
const COLORS = {
    success: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
    error:   { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c" },
    info:    { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
    warning: { bg: "#fffbeb", border: "#fde68a", color: "#92400e" },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast container */}
            <div style={{
                position: "fixed", bottom: "24px", right: "24px",
                display: "flex", flexDirection: "column", gap: "10px",
                zIndex: 9999, pointerEvents: "none",
            }}>
                {toasts.map(t => {
                    const c = COLORS[t.type] || COLORS.info;
                    return (
                        <div key={t.id} style={{
                            backgroundColor: c.bg, border: `1.5px solid ${c.border}`,
                            color: c.color, padding: "12px 16px", borderRadius: "10px",
                            fontSize: "14px", fontWeight: "600", fontFamily: "'Segoe UI', sans-serif",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                            display: "flex", alignItems: "center", gap: "10px",
                            minWidth: "260px", maxWidth: "360px",
                            animation: "fadeInUp 0.3s ease both",
                            pointerEvents: "all", cursor: "pointer",
                        }} onClick={() => remove(t.id)}>
                            <span style={{ fontSize: "18px", flexShrink: 0 }}>{ICONS[t.type]}</span>
                            <span style={{ flex: 1 }}>{t.message}</span>
                            <span style={{ fontSize: "16px", opacity: 0.5, flexShrink: 0 }}>✕</span>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}
