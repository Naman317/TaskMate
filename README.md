# Tasky (TaskMate) — Cloud Workspace & Task Management Platform

<div align="center">

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://tasky-one-iota.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://tasky-production-render.onrender.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)

**Tasky** is an enterprise-grade task management and team workspace platform built with the MERN stack (MongoDB, Express.js, React 18, Node.js). It enables teams to coordinate workflows, assign tasks, track real-time analytics, and invite members seamlessly.

[**Explore Live Application**](https://tasky-one-iota.vercel.app/)

</div>

---

## Live Deployment

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://tasky-one-iota.vercel.app](https://tasky-one-iota.vercel.app/) |
| **Backend REST API** | Render | [https://tasky-production-render.onrender.com](https://tasky-production-render.onrender.com/) |

---

## Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TASKY ARCHITECTURE                            │
├───────────────────┬────────────────────────────┬────────────────────────┤
│   FRONTEND (SPA)  │     BACKEND & SERVICES     │   DATABASE & STORAGE   │
│  React 18 + Vite  │    Node.js + Express.js    │   MongoDB Atlas Cloud  │
│  Tailwind CSS     │    JWT Auth + Bcryptjs     │   Firebase Auth / Cloud│
│  Redux Toolkit    │    Nodemailer (Gmail SMTP) │   Vercel Edge Network  │
│  Framer Motion    │    Express REST API Router │   Render Web Services  │
└───────────────────┴────────────────────────────┴────────────────────────┘
```

### Frontend Technologies
- **Framework**: React 18 (Single Page Application architecture)
- **Build Tool & Bundler**: Vite (Fast HMR and optimized production bundling)
- **Styling**: Tailwind CSS with `@headlessui/react` for accessible UI components
- **State Management**: Redux Toolkit (Session state, auth persistence, sidebar status)
- **Routing**: React Router v6 (Protected routes, invitation landing pages, role guards)
- **Authentication SDK**: Firebase v10 JS SDK (Google OAuth authentication)
- **Animations**: Framer Motion (Transitions, dialogs, layout shifts)
- **Icons & Alerts**: Lucide React, `react-icons`, and Sonner toast notifications
- **Form Handling**: React Hook Form
- **Drag-and-Drop**: `@hello-pangea/dnd` (Kanban board task management)

### Backend Technologies
- **Runtime Environment**: Node.js (ES Modules)
- **Web Framework**: Express.js (RESTful API architecture)
- **Database Driver / ODM**: Mongoose v8 (Schemas, references, populations)
- **Authentication**: JSON Web Tokens (JWT) with HTTP-only cookies and Bearer tokens
- **Password Security**: `bcryptjs` (Salted cryptographic hashing)
- **Email Delivery**: Nodemailer (Gmail SMTP integration with branded HTML templates)
- **Security & Middleware**: `cors` (Whitelisted domain validation), `cookie-parser`, `dotenv`

---

## Core Features & Architecture

### 1. Dual Authentication & Identity Management
- **Google OAuth 2.0**: 1-click login and registration powered by Firebase, synchronized directly into MongoDB with profile avatar extraction.
- **Email & Password Authentication**: Registration and authentication with salted bcrypt hashing and validation.
- **Two-Step Password Reset**: Tokenized password reset with 1-hour expiration and HTML email delivery.
- **Role-Based Access Control (RBAC)**:
  - **Super Admin (`admin@gmail.com`)**: Full system authority, role modification, user deletion, task assignment.
  - **Administrator**: Create, edit, assign, and organize tasks across the workspace.
  - **Team Member**: Dedicated workspace to view assigned tasks, update stages, complete subtasks, and post activity comments.

### 2. 3-Way Team Member Invitation System
- **Mode 1: Universal Copy Link (Figma/Slack Style)**:
  - Generates a tokenized workspace invitation link with zero required form inputs.
  - 1-click Copy Link and Refresh Link triggers for instant sharing across communication channels.
- **Mode 2: Gmail Web Composer**:
  - Pre-populates recipient email and role into Gmail Web composer with an invitation template.
  - Dispatches automated backend Nodemailer notifications to physical inboxes.
- **Mode 3: Instant Database Creation**:
  - Administrators can directly provision team members with Name, Email, Role, and initial Password.

### 3. Invitation Landing & Account Activation (`/accept-invite`)
- **Token Sanitization**: Regex extraction automatically isolates the 48-character token even if malformed by URL sharing.
- **1-Click Google Activation**: Invited members can activate their account using their existing Google account.
- **Manual Password Creation**: Members can set custom display names and choose their own password.

### 4. Kanban Workflow & Task Management
- **Interactive Kanban & List Views**: Move tasks across **To Do**, **In Progress**, and **Completed** stages with zero-latency drag-and-drop.
- **Detailed Task Cards**: Priority levels (High, Medium, Normal, Low), multi-member assignments, due dates, file attachments, and subtask checklists.
- **Activity & Timeline Audit**: Real-time logging of timeline events (task created, team assigned, stage transitioned, subtasks finished, comments added).
- **Trash & Recovery**: Soft-delete safety mechanism with 1-click restore or permanent wipe.

### 5. Persistent Notification Hub
- **Real-Time Polling**: Automated 45-second background synchronization for task assignment alerts.
- **Persistent Read State**: MongoDB `$addToSet` tracking ensures read notifications stay read across page refreshes and browser restarts.
- **Dynamic Badge**: Unread notification counter that updates in real time.

### 6. Voice Commands & Accessibility
- **Speech Recognition Engine**: Integrated Web Speech API for hands-free dashboard navigation and task filtering.
- **Voice Guide Modal**: Interactive guide explaining trigger syntax (`"Create task [name]"`, `"Search for [keyword]"`).

---

## API Architecture & Endpoints

All protected endpoints require a valid JWT via `HttpOnly Cookie` or `Authorization: Bearer <token>`.

### Auth & User Endpoints (`/api/user`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register standard user with email & password |
| `POST` | `/login` | Public | Authenticate user & issue JWT cookie/token |
| `POST` | `/google-auth` | Public | Authenticate or register with Google OAuth |
| `POST` | `/logout` | Authenticated | Destroy user session |
| `POST` | `/forgot-password` | Public | Send 1-hour password reset email |
| `POST` | `/reset-password` | Public | Reset password using reset token |
| `POST` | `/invite-member` | Admin / Super Admin | Create tokenized team invite or instant user |
| `GET` | `/invitation/:token` | Public | Retrieve invitation details by token |
| `POST` | `/accept-invite` | Public | Activate account via invitation token |
| `GET` | `/get-team` | Admin / Super Admin | List all team members in workspace |
| `GET` | `/notifications` | Authenticated | Fetch notifications with `hasRead` & `unreadCount` |
| `PATCH`| `/notification/read/:id` | Authenticated | Mark individual notification as read |
| `PATCH`| `/notification/read-all` | Authenticated | Mark all user notifications as read |
| `PUT` | `/profile` | Authenticated | Update user profile details |
| `PUT` | `/update-role/:id` | Super Admin | Update member system role |
| `PUT` | `/change-password` | Authenticated | Rotate account password |
| `DELETE`| `/:id` | Super Admin | Permanently delete user |

### Task Endpoints (`/api/task`)
| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/create` | Admin / Super Admin | Create task & dispatch team notifications |
| `GET` | `/dashboard` | Authenticated | Fetch dynamic dashboard statistics and charts |
| `GET` | `/` | Authenticated | List tasks with stage/trash/search filters |
| `GET` | `/:id` | Authenticated | Retrieve full task details and timeline |
| `POST` | `/activity/:id` | Authenticated | Post activity comment on task timeline |
| `PUT` | `/create-subtask/:id`| Admin / Super Admin | Append checklist subtask |
| `PUT` | `/update/:id` | Admin / Super Admin | Update task attributes |
| `PUT` | `/change-stage/:id`| Authenticated | Transition task Kanban stage |
| `DELETE`| `/delete-restore/:id`| Admin / Super Admin | Soft-delete or restore task |
| `DELETE`| `/trash` | Super Admin | Hard-delete all trashed tasks |

---

## Environment Variables Reference

### Frontend (`client/.env` / Vercel)
```env
VITE_APP_BASE_URL=https://tasky-production-render.onrender.com
VITE_APP_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_APP_FIREBASE_AUTH_DOMAIN=taskmanager-557d7-57874.firebaseapp.com
VITE_APP_FIREBASE_PROJECT_ID=taskmanager-557d7-57874
VITE_APP_FIREBASE_STORAGE_BUCKET=taskmanager-557d7-57874.firebasestorage.app
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=246625536592
VITE_APP_FIREBASE_APP_ID=1:246625536592:web:e9a9dcd1617440cfdb9f55
```

### Backend (`server/.env` / Render)
```env
PORT=5055
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=production
FRONTEND_URL=https://tasky-one-iota.vercel.app
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_google_app_password
```

---

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Naman317/TaskMate.git
cd TaskMate
```

### 2. Backend Setup
```bash
cd server
npm install
# Configure server/.env using the template above
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
# Configure client/.env using the template above
npm run dev
```

The application will run locally at `http://localhost:5173` with API proxying to `http://localhost:5055`.

---

## Security & Best Practices
- **Protected Secrets**: Multi-tiered `.gitignore` protects all `.env` files and compiled `dist/` bundles from source control.
- **Sanitized Git History**: Purged historical commit references to guarantee no sensitive keys are stored in past revisions.
- **CORS & Cookie Protection**: Cross-site requests isolated and cookies secured with `SameSite: "none"` and `Secure: true`.

---

<div align="center">
Designed, developed, and deployed by <strong>Naman Sharma</strong>.
</div>
