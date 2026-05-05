# Tasky - Professional Task Management Platform

Tasky is a high-performance, scalable task management platform engineered using the MERN stack (MongoDB, Express.js, React, Node.js). Designed for team productivity, it provides a seamless interface for organizing workflows, tracking progress, and managing team assignments securely.

---
## Live 

- Vercel + Railway → https://tasky-one-iota.vercel.app/
- Netlify + Render → https://tasky-project-assignment.netlify.app
## Core Features

### Advanced Role-Based Access Control (RBAC)
A strict 3-tier hierarchy ensures system security and data integrity:
- **Super Admin (`admin@gmail.com || pass: admin@gmail.com`)**: Complete system authority. Can manage users, alter permissions, and oversee all platform activity.
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

### API Architecture & Endpoints

The backend exposes a mature, versioned RESTful API (`/api/v1/*` structured). All protected routes require a valid JWT passed via `HttpOnly Cookie` OR the `Authorization: Bearer` header.

#### User & Authentication API (`/api/user`)
| Method | Endpoint | Access Level | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user | `{ name, email, password, title, role }` |
| `POST` | `/login` | Public | Authenticate user & issue JWT | `{ email, password }` |
| `POST` | `/logout` | Authenticated | Destroy session cookie | - |
| `GET` | `/get-team` | Admin / Super Admin | Retrieve organization members | - |
| `GET` | `/notifications` | Authenticated | Fetch unread activity alerts | `?isRead=boolean` |
| `PUT` | `/profile` | Authenticated | Update user's own profile | `{ name, title, role }` |
| `PUT` | `/read-noti` | Authenticated | Mark notification as read | `?isReadType=all` |
| `PUT` | `/change-password`| Authenticated | Secure password rotation | `{ password }` |
| `DELETE`| `/:id` | Super Admin | Remove user from system | - |

#### Task Management API (`/api/task`)
| Method | Endpoint | Access Level | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/create` | Admin / Super Admin | Create a new task | `{ title, team, stage, date, priority }` |
| `GET` | `/dashboard` | Authenticated | Retrieve metrics & graph data | - |
| `GET` | `/` | Authenticated | List tasks with filters | `?stage=todo&isTrashed=false&search=query` |
| `GET` | `/:id` | Authenticated | Fetch specific task details | - |
| `POST` | `/activity/:id` | Authenticated | Post a comment/activity log | `{ type, activity }` |
| `PUT` | `/create-subtask/:id`| Admin / Super Admin | Append subtask to parent | `{ title, date, tag }` |
| `PUT` | `/update/:id` | Admin / Super Admin | Mutate task details | `{ title, date, stage, priority }` |
| `PUT` | `/change-stage/:id`| Authenticated* | Move task (Kanban drag-drop) | `{ stage }` (*Users only move assigned tasks) |
| `DELETE`| `/delete-restore/:id`| Admin / Super Admin | Soft delete or restore task | `?actionType=restore` |
| `DELETE`| `/trash` | Super Admin | Hard delete trashed tasks | `?actionType=deleteAll` |

#### API Request Lifecycle
1. **Request Ingress**: Receives standard JSON payload.
2. **CORS & Proxy**: Express configuration explicitly allows trusted domains (Vercel, Render, Netlify) and trusts reverse proxies.
3. **Authentication Guard (`protectRoute`)**: Extracts JWT from `req.cookies` or `req.headers`. Verifies signature via `jsonwebtoken`. Resolves user ID against MongoDB.
4. **Authorization Guard (`isAdminRoute`)**: Checks `req.user.isAdmin` or super-admin email override before proceeding to restricted controllers.
5. **Controller Execution**: Executes Mongoose aggregate pipelines or CRUD operations.
6. **Error Handlers (`errorHandler`)**: Catches async rejections and returns standardized `{ status: false, message: string }` payload.


## Technical Stack

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

## Getting Started

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

<div align="center">
Designed, developed, and deployed with curiosity by Naman Sharma.
</div>

