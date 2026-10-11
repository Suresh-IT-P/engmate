@echo off
setlocal

echo ===================================================
echo   English Mate - Android APK Build Script
echo ===================================================

set "JAVA_HOME=C:\APK-Notes\jdk17\jdk-17.0.20.1+1"
set "ANDROID_HOME=C:\APK-Notes\android-sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

echo [1/3] Building Frontend Web Assets (Vite)...
cd /d "%~dp0frontend"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Frontend build failed!
    exit /b %ERRORLEVEL%
)

echo [2/3] Syncing Capacitor Assets...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Capacitor sync failed!
    exit /b %ERRORLEVEL%
)

echo [3/3] Compiling Android APK with Gradle...
cd /d "%~dp0frontend\android"
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Gradle build failed!
    exit /b %ERRORLEVEL%
)

copy /y "%~dp0frontend\android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0EnglishMate.apk"

echo.
echo ===================================================
echo   BUILD SUCCESSFUL!
echo   APK generated at: %~dp0EnglishMate.apk
echo ===================================================
endlocal
pause
