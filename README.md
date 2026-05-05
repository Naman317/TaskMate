# Tasky - Professional Task Management Platform

Tasky is a high-performance, scalable task management platform engineered using the MERN stack (MongoDB, Express.js, React, Node.js). Designed for team productivity, it provides a seamless interface for organizing workflows, tracking progress, and managing team assignments securely.

---

## 🌟 Core Features

### Advanced Role-Based Access Control (RBAC)
A strict 3-tier hierarchy ensures system security and data integrity:
- **Super Admin (`admin@gmail.com`)**: Complete system authority. Can manage users, alter permissions, and oversee all platform activity.
- **Administrator**: Authorized to create, assign, and manage tasks across the organization. Restricted from modifying core administrative roles.
- **Team Member**: Dedicated workspace environment limited to viewing and updating assigned tasks.

### Modern UI/UX Architecture
- **Optimistic UI Updates**: Zero-latency drag-and-drop task progression between Kanban stages ("To Do", "In Progress", "Completed") without waiting for network resolution.
- **Dynamic Interface**: Engineered with Tailwind CSS and Framer Motion for responsive layouts, subtle glassmorphism, and fluid micro-interactions.
- **Automated Overdue Tracking**: Real-time algorithmic surfacing of overdue tasks on the primary dashboard analytics panel.

### Accessibility & Voice Control
Native browser Web Speech API integration enables hands-free operation:
- `"Create task [name]"` - Initializes a pre-filled task creation sequence.
- `"Search for [keyword]"` - Triggers real-time client-side filtering.
- `"Move [task] to in progress"` - Executes API-driven stage transitions via voice.
- `"Mark [task] as completed"` - Instantly resolves designated tasks.

---

## 💻 Technical Stack

### Frontend Architecture
- **Framework**: React 18 + Vite (optimized build tooling and HMR)
- **State Management**: Redux Toolkit (global state) & RTK Query (server state and caching)
- **Styling**: Tailwind CSS, Headless UI (accessible unstyled components)
- **Routing**: React Router DOM v6
- **Interactions**: `@hello-pangea/dnd` (robust drag-and-drop), `framer-motion` (animations)

### Backend Architecture
- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ORM
- **Security & Auth**: JSON Web Tokens (JWT), HTTP-only cookies, bcryptjs password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Instance (Local or Atlas)

### 1. Local Setup
Clone the repository to your local machine:
```bash
git clone https://github.com/Naman317/Tasky.git
cd Tasky
```

### 2. Backend Initialization
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
PORT=5055
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Initialization
Open a new terminal session:
```bash
cd client
npm install
```
Create a `.env` file in the `/client` directory:
```env
VITE_APP_BASE_URL=http://localhost:5055/api
```
Start the Vite development server:
```bash
npm run dev
```

---

## 📖 Directory Structure

```text
├── client/
│   ├── src/
│   │   ├── components/      # Modular, reusable UI components
│   │   ├── pages/           # Route-level views (Dashboard, Tasks)
│   │   ├── redux/           # Global store configurations and RTK Query endpoints
│   │   └── assets/          # Static assets and Axios interceptor configurations
│   └── vite.config.js
│
├── server/
│   ├── controllers/         # Core business logic and request handling
│   ├── middlewares/         # JWT validation, error handling, and RBAC guards
│   ├── models/              # Mongoose schema definitions
│   ├── routes/              # Express API endpoint mapping
│   └── index.js             # Application entry point and server configuration
```

---

## 🤝 Contribution Standards

When contributing to this repository, please adhere to the following software engineering standards:
1. **State Management**: Utilize `RTK Query` in the `apiSlice` for all network requests to leverage built-in caching and invalidation, rather than one-off Axios calls.
2. **Component Design**: Maintain the established Tailwind CSS design system. Ensure new components are responsive and accessible.
3. **Security**: Respect the established RBAC middleware (`protectRoute`, `isAdminRoute`) when exposing or modifying backend endpoints.

*Engineered by Naman.*
