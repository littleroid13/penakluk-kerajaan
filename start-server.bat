@echo off
title PENAKHLUKAN KERAJAAN - Localhost Server
cls
echo ==============================================================
echo    MENJALANKAN SERVER PENAKHLUKAN KERAJAAN (LOCALHOST)
echo ==============================================================
echo.

:: Cek apakah Node.js terpasang
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js terdeteksi. Memulai server...
    node server.js
    goto end
)

:: Jika Node.js tidak ditemukan, coba gunakan Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Node.js tidak ditemukan, menggunakan server bawaan Python...
    echo Buka browser pada alamat: http://localhost:3000
    start "" http://localhost:3000
    python -m http.server 3000
    goto end
)

echo [ERROR] Tidak ditemukan Node.js maupun Python pada sistem Anda.
echo Silakan unduh dan pasang Node.js dari https://nodejs.org
echo.
pause

:end
