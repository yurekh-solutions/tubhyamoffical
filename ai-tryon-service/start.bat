@echo off
setlocal
echo ========================================
echo Starting Tubhyam AI Try-On Service
echo ========================================
echo.

cd /d "%~dp0"

if not exist venv\Scripts\python.exe (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Server will start on http://localhost:8000
echo API docs: http://localhost:8000/docs
echo First generation loads the model - allow 2-5 minutes.
echo Press Ctrl+C to stop.
echo.
venv\Scripts\python.exe server.py

pause
