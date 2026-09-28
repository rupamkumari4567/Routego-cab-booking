@echo off
title RouteGo Cab Booking
cd /d "%~dp0"
echo Installing packages...
npm install
if errorlevel 1 (echo npm install failed. Check Node.js and internet access.&pause&exit /b 1)
npm run dev
pause
