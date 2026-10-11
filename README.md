# ToDo App (.NET 10 + Angular)

This is a full-stack ToDo application. The backend is built with **.NET 10** using a Modular Monolith design. The frontend is built with **Angular** and uses **pnpm** for speed and package management.

---

## 🗺️ Architecture Documentation
To see the architecture for backend and front end, see these md files:
*   [Backend Design (Modular Monolith)](./docs/architecture-backend.md)
*   [Frontend Design (Angular)](./docs/architecture-frontend.md)

---

## 🛠️ Setup

Make sure you have these installed on your machine before running the app:

### 1. .NET 10 SDK
* Download it from the official [Microsoft .NET Portal](https://microsoft.com).

### 2. Node.js & pnpm
* Download **Node.js (LTS version)** from the official [Node.js Page](https://nodejs.org).
* Open **PowerShell as an Administrator** and run these commands to set up `pnpm` and allow scripts to run:
  ```powershell
  corepack enable
  corepack prepare pnpm@latest --activate
  Set-ExecutionPolicy RemoteSigned -Scope LocalMachine
  ```

---

## 🚀 How to Run Locally

You can run this entire stack directly from your terminal or command prompt.

### Step 1: Start the Backend
1. Open a terminal window at the root of the project.
2. Navigate to the `WebApp` directory:
   ```bash
   cd src/apps/WebApp
   ```
3. Run the .NET 10 project:
   ```bash
   dotnet run
   ```
   *(The server will start hosting the API on `http://localhost:5000`)*

### Step 2: Start the Frontend
1. Open a **second** terminal window at the root of the project.
2. Navigate to the frontend client directory:
   ```bash
   cd src/client
   ```
3. Boot up the Angular development server:
   ```bash
   pnpm run start
   ```
4. Open your browser and navigate to `http://localhost:4200`.

### 🔑 Test Account
* **Username:** `demo`
* **Password:** `demo`
