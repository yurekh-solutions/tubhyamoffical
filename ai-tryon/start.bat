@echo off
echo ========================================
echo Starting Tubhyam AI Try-On Service
echo ========================================
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

echo Starting FastAPI server on port 8000...
echo API Docs: http://localhost:8000/docs
echo.

python main.py

pause
