@echo off
echo Starting development server...
echo Logs will be saved to logs/dev.log

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Start the development server with logging
npx tsx server.ts 2>&1 | tee logs/dev.log

if %errorlevel% neq 0 (
    echo.
    echo ERROR: tee command not found. Using alternative logging method...
    echo.
    
    REM Alternative method without tee
    npx tsx server.ts 2>logs/dev-error.log 1>logs/dev-out.log
    
    REM Display output in real-time
    echo Development server started. Check logs/dev-out.log for output.
    echo Press Ctrl+C to stop the server.
    
    REM Keep the window open
    pause
)