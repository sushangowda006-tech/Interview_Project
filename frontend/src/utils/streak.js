// Manages daily login streak in localStorage

export function updateStreak() {
    const today     = new Date().toDateString();
    const data      = JSON.parse(localStorage.getItem("streak") || "{}");
    const lastLogin = data.lastLogin || "";
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastLogin === today) {
        // Already logged in today — no change
        return data;
    }

    let streak = data.streak || 0;
    if (lastLogin === yesterday) {
        streak += 1; // consecutive day
    } else {
        streak = 1;  // reset
    }

    const updated = { streak, lastLogin: today, longest: Math.max(streak, data.longest || 0) };
    localStorage.setItem("streak", JSON.stringify(updated));
    return updated;
}

export function getStreak() {
    return JSON.parse(localStorage.getItem("streak") || "{ \"streak\": 0, \"longest\": 0 }");
}
