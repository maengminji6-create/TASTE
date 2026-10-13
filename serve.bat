@echo off
chcp 65001 > nul
cd /d "%~dp0"
python serve.py %*
if errorlevel 1 (
  echo.
  echo Python이 설치되어 있지 않다면 https://www.python.org 에서 설치한 뒤 다시 실행해 주세요.
  pause
)
