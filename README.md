# InvenTrack – Inventory Management System

A full-stack inventory management application designed to simplify product tracking, stock monitoring, and inventory operations through a centralized dashboard.

## Overview

InvenTrack is a web-based inventory management system built to help businesses manage products, monitor stock levels, and maintain organized inventory records. It provides a user-friendly interface and a backend API connected to a MySQL database.

## Technology Stack

**Frontend**
- Angular
- TypeScript
- HTML5
- CSS3

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Hibernate

**Database**
- MySQL

**Tools**
- Visual Studio Code
- Git and GitHub
- Maven
- npm

## Project Structure

```text
Inventory-Management/
│
├── backend/
│   └── inventory-backend/
│       ├── src/
│       ├── pom.xml
│       └── mvnw
│
├── frontend/
│   └── inventory-frontend/
│       ├── src/
│       ├── angular.json
│       └── package.json
│
├── .gitignore
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## Features

- Product management
- Inventory and stock tracking
- Centralized product records
- Frontend and backend integration
- MySQL database connectivity
- REST API-based communication

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Angular CLI
- Java JDK
- MySQL
- Maven

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Yash0029/iNVENTORY-Management-InvenTrack-.git
cd iNVENTORY-Management-InvenTrack-
```

### 2. Start the Backend

```bash
cd backend/inventory-backend
./mvnw spring-boot:run
```

Backend runs on:

`http://localhost:8080`

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend/inventory-frontend
npm install
ng serve
```

Frontend runs on:

`http://localhost:4200`

## Database Configuration

Configure your MySQL database connection in the backend application configuration.

Update the database URL, username, and password according to your local MySQL setup.

Never commit database passwords or other sensitive credentials to GitHub.

## Future Enhancements

- User authentication and authorization
- Low-stock alerts
- Inventory analytics and reports
- Product category management
- Advanced dashboard features

## Author

**Yash Kumar**

GitHub: [@Yash0029](https://github.com/Yash0029)

---

*InvenTrack – Simplifying Inventory Management.*


⚠️ Important Notice – Live Demo Temporarily Unavailable

Please Note: The live deployment of InvenTrack is temporarily unavailable due to a service disruption with the hosting platform.

The application source code, features, and project documentation are still available in this repository. The live demo will be restored once the hosting platform becomes stable and deployment is resumed.

Current Status: 🔴 Temporarily Offline
Deployment Status: Pending Restoration

Thank you for your understanding.
