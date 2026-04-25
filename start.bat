@echo off
echo Starting Backend...
start "Backend" cmd /k "cd /d "%~dp0backend\interview" && mvnw.cmd spring-boot:run"

echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Both servers started!
echo Backend: http://localhost:1212
echo Frontend: http://localhost:5173
