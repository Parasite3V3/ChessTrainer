@echo off
chcp 65001 >nul
echo ========================================
echo   ChessTrainer - Шахматный тренажёр
echo ========================================
echo.

REM Проверка наличия Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не найден!
    echo.
    echo Пожалуйста, установите Node.js с официального сайта:
    echo https://nodejs.org
    echo.
    echo Выберите LTS версию для Windows.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js найден
node --version
echo.

REM Проверка наличия node_modules
if not exist "node_modules\" (
    echo [ИНФО] Установка зависимостей...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ОШИБКА] Не удалось установить зависимости!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Зависимости установлены
    echo.
) else (
    echo [OK] Зависимости уже установлены
    echo.
)

echo [ИНФО] Запуск сервера разработки...
echo.
echo Приложение откроется в браузере автоматически.
echo Для остановки нажмите Ctrl+C
echo.
echo ========================================
echo.

call npm run dev

pause


