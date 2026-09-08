@echo off
setlocal
echo ========================================
echo Tubhyam AI Try-On Service Setup
echo ========================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

if not exist venv\Scripts\python.exe (
    echo [1/4] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
) else (
    echo [1/4] Virtual environment already exists
)

set PY=venv\Scripts\python.exe

echo [2/4] Installing PyTorch with CUDA ^(2.8 GB download - one time^)...
"%PY%" -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
if errorlevel 1 (
    echo ERROR: Failed to install PyTorch
    pause
    exit /b 1
)

echo [3/4] Installing remaining dependencies...
"%PY%" -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [4/4] Setup complete!
echo.
echo ========================================
echo Next steps:
echo   1. Run: start.bat   ^(starts AI service on port 8000^)
echo   2. Test: venv\Scripts\python.exe test_tryon.py
echo   3. First generation downloads SD1.5 + IP-Adapter weights (~4 GB, one time)
echo ========================================
echo.
pause
