@echo off
title ClipForge AI
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 20+ from https://nodejs.org/
  pause
  exit /b 1
)
if not exist .env (
  copy .env.example .env >nul
  echo Add your OPENAI_API_KEY to .env. Notepad will open now.
  notepad .env
)
if not exist node_modules (
  echo Installing packages...
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
echo Keep this window open, then visit http://localhost:3000
call npm start
pause
