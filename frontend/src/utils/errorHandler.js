// Maps API errors to user-friendly messages
export function getErrorMessage(err) {
    if (!err.response) {
        return "⚠️ Network error. Please check your connection and try again.";
    }
    const status = err.response?.status;
    const serverMsg = err.response?.data?.error || err.response?.data?.message || "";

    if (status === 400) {
        if (serverMsg.toLowerCase().includes("email already")) return "❌ This email is already registered. Try logging in.";
        if (serverMsg.toLowerCase().includes("password"))      return "❌ Invalid password. Please try again.";
        if (serverMsg)                                          return `❌ ${serverMsg}`;
        return "❌ Invalid request. Please check your input.";
    }
    if (status === 401) return "❌ Invalid email or password.";
    if (status === 403) return "❌ You don't have permission to do this.";
    if (status === 404) return "❌ Resource not found.";
    if (status === 500) return "❌ Server error. Please try again later.";
    if (serverMsg)      return `❌ ${serverMsg}`;
    return "❌ Something went wrong. Please try again.";
}
