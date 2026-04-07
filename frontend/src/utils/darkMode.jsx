import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext(null);

export function useDarkMode() {
    return useContext(DarkModeContext);
}

export function DarkModeProvider({ children }) {
    const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    const toggle = () => setDark(d => !d);

    return (
        <DarkModeContext.Provider value={{ dark, toggle }}>
            {children}
        </DarkModeContext.Provider>
    );
}
