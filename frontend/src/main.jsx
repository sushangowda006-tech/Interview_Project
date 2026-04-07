import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './utils/toast.jsx'
import { DarkModeProvider } from './utils/darkMode.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <DarkModeProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </DarkModeProvider>
    </BrowserRouter>
)