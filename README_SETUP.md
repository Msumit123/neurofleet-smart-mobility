# NeuroFleet Smart Mobility - Setup Guide

This project consists of a React Frontend and a Java Spring Boot Backend.

## Prerequisites

1.  **Java Development Kit (JDK) 17 or higher**:
    *   Download and install from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/).
    *   **Important**: Ensure `JAVA_HOME` environment variable is set correctly and `java` is in your system PATH.
2.  **Node.js**:
    *   Download and install from [nodejs.org](https://nodejs.org/).
3.  **Maven** (Optional, included wrapper usually works but having it installed is better):
    *   Download from [maven.apache.org](https://maven.apache.org/).

## Project Structure

*   `backend/`: Java Spring Boot application (API, Database, Auth).
*   `src/`: React Frontend application.

## How to Run

### 1. Start the Backend

Open a terminal in the `backend` directory and run:

```bash
cd backend
# Windows
mvnw.cmd spring-boot:run
# Linux/Mac
./mvnw spring-boot:run
```

If you don't have the Maven wrapper (`mvnw`) generated yet (since I just created the pom.xml manually), you can run with installed Maven:

```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8081**.
H2 Console (Database) is available at **http://localhost:8081/h2-console** (User: `sa`, Password: `password`).

### 2. Start the Frontend

Open a new terminal in the root directory and run:

```bash
npm install
npm run dev
```

The frontend will start on **http://localhost:8080** (or similar, check terminal output).

## Features Implemented

*   **Authentication**: Login and Signup with JWT.
*   **Role-Based Access**: Admin, Fleet Manager, Driver, Customer.
*   **Database**: H2 In-Memory Database (Data is lost on restart).
*   **Frontend Integration**: Connected Auth Context to Real Backend API.

## Troubleshooting

*   **Java Error**: If you see "JAVA_HOME not set", please set your JAVA_HOME environment variable to your JDK installation path.
*   **Port Conflict**: If port 8080 or 8081 is busy, change `server.port` in `backend/src/main/resources/application.properties`.
