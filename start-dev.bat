@echo off
setlocal
echo Starting NeuroFleet Development Environment...

REM Set JAVA_HOME to JDK 23
set "JAVA_HOME=C:\Program Files\Java\jdk-23"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo JAVA_HOME set to %JAVA_HOME%
java -version

echo Starting Backend (Spring Boot)...
start "NeuroFleet Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Starting Frontend (Vite)...
start "NeuroFleet Frontend" cmd /k "npm run dev"

echo Done! Backend running on port 8081, Frontend on port 8080.
pause
