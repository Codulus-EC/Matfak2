@echo off
setlocal
cd /d "%~dp0frontend"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install Node.js 20+ from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting Matfak VSU at http://localhost:3000
call npm run dev
