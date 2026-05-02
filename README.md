# Tasky - Professional Task Management Platform

Tasky is a modern, full-stack, SaaS-level task management application designed for seamless team collaboration. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Redux Toolkit Query, Tasky offers a highly responsive, optimistic UI with real-time drag-and-drop capabilities.

## 🌟 Key Features

### 🔐 Advanced Role-Based Access Control (RBAC)
- **Super Admin (`admin@gmail.com`)**: Complete platform control. The only role capable of assigning or revoking Admin privileges, managing all users, and retaining absolute immunity.
- **Admin**: Can create, assign, update, and delete tasks across the entire team. Cannot modify user roles.
- **Team Member**: Focused workspace. Can only view and update tasks specifically assigned to them.

### 🚀 SaaS-Grade User Experience
- **Optimistic UI (Zero-Latency Updates)**: Leveraging RTK Query, actions like dragging a task to a new stage happen instantly on the screen without waiting for the server, creating a native-app feel.
- **Drag & Drop Board View**: A highly interactive, Trello-style Kanban board built with `@hello-pangea/dnd` for fluid task stage transitions.
- **Global Command Palette (`Ctrl + K`)**: Instantly search across all tasks and navigate the application without taking your hands off the keyboard.
- **Data Export**: Seamlessly export filtered task views to CSV for reporting and spreadsheet integration.
- **Interactive Subtasks**: Break down large tasks into trackable sub-components with independent completion toggles.

### 🔔 Smart Task Tracking
- **Automated Overdue Detection**: Tasks that miss their due dates are automatically flagged with visual pulsing indicators and routed to the dedicated "Overdue" view.
- **Comprehensive Activity Logs**: Every creation, stage change, and subtask update is meticulously tracked in the task's timeline.

## 🛠️ Technology Stack

### Frontend
- **React.js (Vite)**: Lightning-fast development and optimized production builds.
- **Redux Toolkit Query**: Centralized state management, API caching, and automated UI synchronization.
- **Tailwind CSS**: Modern utility-first styling with custom glassmorphism and premium design tokens.
- **Framer Motion**: Smooth, physics-based animations for modals, sidebars, and transitions.

### Backend
- **Node.js & Express.js**: Robust API architecture with strict routing and middleware protection.
- **MongoDB & Mongoose**: Flexible NoSQL database with advanced schema validation and reference population.
- **JSON Web Tokens (JWT)**: Secure, HTTP-only cookie-based authentication.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB URI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Naman317/Tasky.git
   cd Tasky
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=8800
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
   Start the server:
   ```bash
   npm start
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_APP_BASE_URL=http://localhost:8800/api
   ```
   Start the client:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open `http://localhost:5173` in your browser.
   To access Super Admin privileges, register or log in with the email `admin@gmail.com`.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
