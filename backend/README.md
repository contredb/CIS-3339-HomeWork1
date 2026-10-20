# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

# CIS 3339 Homework 1 - Full Stack Application

## Project Overview & Description

This project is a full-stack web application built for an academic assignment designed using a modern **Vue 3** frontend, an **Express.js** backend, and a **MongoDB** database. 

The application serves as a dynamic, data-driven system where users can interact with a responsive user interface to perform CRUD (Create, Read, Update, Delete) operations. All user interactions flow seamlessly from the client-side interface down to the database storage layer.

---

## How It Works (Architecture & Workflow)

The application operates on a decoupled client-server architecture that comes together into a unified deployment workflow:

1. **Frontend (Vue 3 + Vite):**
   * Built using Vue 3 composition patterns and reactive components.
   * Handles user inputs, navigation, form validations, and asynchronous HTTP requests to communicate with the backend API.
   * During production, the frontend code is compiled into optimized static HTML, CSS, and JavaScript assets via `npm run build`[cite: 1], outputting directly into a distribution folder.

2. **Backend (Node.js + Express):**
   * Acts as the core RESTful API server. It listens for incoming HTTP requests from the frontend, executes business logic, and interacts with the database.
   * **Static Asset Serving:** In production, the Express server is configured to serve the compiled Vue 3 static files directly, allowing the entire application to run seamlessly on a single port (`http://localhost:3000`)[cite: 1].

3. **Database Layer (MongoDB + Mongoose):**
   * Connects locally to MongoDB Community Edition using environment variables defined in the backend `.env` file[cite: 1].
   * Uses **Mongoose** schemas and models to structure, validate, and persist data cleanly.
   * Features automatic schema and collection generation, meaning the application initializes smoothly against a fresh, empty local database on first startup without requiring manual migration or seeding scripts[cite: 1].

# Full-Stack Vue 3, Express, and MongoDB Application

## Required Software
Ensure you have the following software installed on your machine:
* **Node.js** (v18+ recommended)
* **npm** (Node Package Manager)
* **MongoDB Community Edition** (running locally)

---

## Required Environment Variables
The application relies on a `.env` file located inside the `backend` directory with the following variables:
* `PORT` - The port number for the Express server (e.g., `3000`)
* `MONGODB_URI` - The connection string for your local MongoDB instance (e.g., `mongodb://localhost:27017/your_database_name`)

---

## Dependency Installation Commands
To install all required dependencies for both the backend and frontend, run the following commands in your terminal:

1. **Backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## Installation & Deployment Workflow
Run the following commands in order to install dependencies, build the frontend, and start the production server:

```bash
# 1. Install dependencies for backend and frontend
npm install

# 2. Build the Vue 3 frontend for production
npm run build

# 3. Start the application backend (which serves the built frontend)
npm start
```

---

## Local MongoDB Community Edition Startup Instructions
1. Ensure your local MongoDB service is running (e.g., via MongoDB Compass or your system's service manager: `net start MongoDB` on Windows or `brew services start mongodb-community` on macOS).
2. The application is configured to connect automatically upon server startup. No manual configuration, database creation, seeding, or migration steps are required; Mongoose handles collections and schemas dynamically.

---

## Production Build Command
To compile the Vue 3 frontend into static production assets:
```bash
cd frontend
npm run build
```

---

## Server Start Command
To start the Express backend server (which also serves the built frontend application in production):
```bash
cd backend
node server.js
```

---

## Localhost URL
Once the server is running, open your browser and navigate to:
* **`http://localhost:3000`** (or your configured backend port)