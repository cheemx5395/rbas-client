# Rule Based Approval System (RBAS) - Frontend
A low-scoped frontend application for managing approval workflows including Leave, Expense, and Discount requests with role-based access control.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Local Development Setup](#local-development-setup)
5. [Project Structure](#project-structure)
6. [Application Pages](#application-pages)
7. [Authentication Flow](#authentication-flow)
8. [Role-Based Access Control](#role-based-access-control)
9. [Form Validations](#form-validations)
10. [API Integration](#api-integration)
11. [State Management](#state-management)
12. [Accomplished Requirements](#accomplished-requirements)
13. [Testing Checklist](#testing-checklist)

## Project Overview

The Rule Based Approval System (RBAS) is a web-based application designed to streamline organizational approval workflows. The system supports three types of requests:

- **Leave Requests**: Sick leave, paid leave, and unpaid leave management
- **Expense Requests**: Food, travel, accommodation, and other expense claims
- **Discount Requests**: Loan discounts, festive discounts, and other discount applications

The application implements a hierarchical approval system with automated rule-based processing and manual review capabilities.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Vite** | 5.x | Build tool and development server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **TanStack React Query** | 5.83.0 | Server state management, caching, and mutations |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Axios** | 1.13.3 | HTTP client for API requests |
| **React Hook Form** | 7.61.1 | Form state management |
| **Zod** | 3.25.76 | Schema validation |
| **Lucide React** | 0.462.0 | Icon library |
| **date-fns** | 3.6.0 | Date manipulation utilities |

## Prerequisites

Before setting up the project locally, ensure you have the following installed:

| Requirement | Minimum Version | Verification Command |
|-------------|-----------------|---------------------|
| **Node.js** | 18.x or higher | `node --version` |
| **npm** | 9.x or higher | `npm --version` |

> **Note**: The backend API server must be running on `http://localhost:8000` for the application to function correctly.

## Local Development Setup

Follow these steps to set up the project on your local machine:

### Step 1: Clone the Repository

```bash
git clone https://github.com/cheemx5395/rbas-client.git
cd rbas-client
```

### Step 2: Install Dependencies

```bash
npm install
```

This command installs all required packages defined in `package.json`.

### Step 3: Verify Backend Availability

Ensure the backend API is running at `http://localhost:8000`. The frontend expects the following API endpoints to be available:

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET /api/approval/requests/`
- `GET /api/approval/policies/`
- `GET /api/approval/admin/analytics/summary/`

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── api/                    # API client and endpoint definitions
│   ├── client.ts           # Axios instance with interceptors
│   ├── auth.ts             # Authentication API calls
│   ├── requests.ts         # Request management API calls
│   ├── policies.ts         # Policy management API calls
│   ├── analytics.ts        # Analytics API calls
│   └── index.ts            # API exports
│
├── components/             # Reusable UI components
│   ├── badges/             # Status and role badges
│   │   └── Badges.tsx
│   ├── layout/             # Layout components
│   │   └── AppLayout.tsx
│   ├── stats/              # Statistics display components
│   │   └── StatCard.tsx
│   ├── ui/                 # shadcn/ui components
│   └── ProtectedRoute.tsx  # Route guard component
│
├── contexts/               # React Context providers
│   └── AuthContext.tsx     # Authentication state management
│
├── hooks/                  # Custom React hooks
│   ├── useRequests.ts      # Request data hooks
│   ├── usePolicies.ts      # Policy data hooks
│   └── useAnalytics.ts     # Analytics data hooks
│
├── pages/                  # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   ├── Requests.tsx
│   ├── NewRequest.tsx
│   ├── RequestDetail.tsx
│   ├── AdminRequests.tsx
│   ├── AdminPolicies.tsx
│   ├── AdminAnalytics.tsx
│   └── NotFound.tsx
│
├── types/                  # TypeScript type definitions
│   └── index.ts
│
├── lib/                    # Utility functions
│   └── utils.ts
│
├── App.tsx                 # Main application component
├── main.tsx                # Application entry point
└── index.css               # Global styles and design tokens
```

## Application Pages

### Public Routes (No Authentication Required)

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | User authentication with username and password |
| `/register` | Register | New user registration with role and grade selection |

### Protected Routes (Authentication Required)

| Route | Page | Roles Allowed | Description |
|-------|------|---------------|-------------|
| `/` | Redirect | All | Redirects to `/dashboard` |
| `/dashboard` | Dashboard | All | Overview of user's requests and statistics |
| `/profile` | Profile | All | User profile information display |
| `/requests` | Requests | All | List of user's own requests with filtering |
| `/requests/new` | New Request | All | Create new Leave, Expense, or Discount request |
| `/requests/:id` | Request Detail | All | View and manage individual request details |

### Admin/Manager Routes (Elevated Permissions Required)

| Route | Page | Roles Allowed | Description |
|-------|------|---------------|-------------|
| `/admin/requests` | Admin Requests | ADMIN, MANAGER | View and manage all system requests |
| `/admin/policies` | Admin Policies | ADMIN | CRUD operations for approval policies |
| `/admin/analytics` | Admin Analytics | ADMIN | System-wide analytics and statistics |

## Authentication Flow

### Login Process

1. User submits username and password on `/login`
2. Frontend sends `POST /api/auth/login/` request
3. Backend returns `access` token, `refresh` token, and user object
4. Tokens are stored in `localStorage`:
   - `access_token`: Used for API authorization
   - `refresh_token`: Used for session refresh
5. User is redirected to `/dashboard`

### Session Persistence

1. On application load, `AuthContext` checks for existing `access_token`
2. If token exists, `GET /api/auth/me/` is called to validate and fetch user data
3. If validation fails (401), tokens are cleared and user is redirected to `/login`

### Token Attachment

All authenticated API requests include the Authorization header:
```
Authorization: Bearer <access_token>
```

This is handled automatically by Axios interceptors in `src/api/client.ts`.

### Logout Process

1. User clicks logout
2. `POST /api/auth/logout/` is called with refresh token
3. Local tokens are cleared from `localStorage`
4. User is redirected to `/login`

---

## Role-Based Access Control

### User Roles

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **USER** | Basic | Create/view own requests, edit/delete pending requests |
| **MANAGER** | Elevated | All USER capabilities + view all requests, approve/reject/flag requests |
| **ADMIN** | Full | All MANAGER capabilities + policy management, analytics access |

### Route Protection

The `ProtectedRoute` component enforces access control:

```tsx
<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
  <AdminRequests />
</ProtectedRoute>
```

- Routes without `allowedRoles` prop: Any authenticated user
- Routes with `allowedRoles` prop: Only specified roles

### Access Denied Behavior

- Unauthenticated users → Redirected to `/login`
- Insufficient role → Redirected to `/dashboard`

## Form Validations

### Registration Form (`/register`)

| Field | Validation Rules |
|-------|-----------------|
| Username | Required, minimum 1 characters |
| Email | Required, must be valid email format |
| Password | Required, minimum 8 characters |
| Role | Required, one of: USER, MANAGER, ADMIN |
| Grade | Required, one of: GRADE1, GRADE2, GRADE3, NA |

### Login Form (`/login`)

| Field | Validation Rules |
|-------|-----------------|
| Username | Required, minimum 1 characters |
| Password | Required, minimum 8 characters |

### Leave Request Form

| Field | Validation Rules |
|-------|-----------------|
| Leave Type | Required, one of: SICK, PAID, UNPAID |
| From Date | Required, valid date format |
| To Date | Required, valid date format, must be >= from_date |
| Reason | Required, text description |

### Expense Request Form

| Field | Validation Rules |
|-------|-----------------|
| Amount | Required, positive number |
| Category | Required, one of: FOOD, TRAVEL, ACCOMMODATION, OTHER |
| Description | Optional, text description |

### Discount Request Form

| Field | Validation Rules |
|-------|-----------------|
| Discount Percentage | Required, number between 0-100 |
| Discount Category | Optional, one of: LOAN, FESTIVE, OTHER |
| Description | Optional, text description |

### Policy Form (Admin)

| Field | Validation Rules |
|-------|-----------------|
| Request Type | Required, one of: LEAVE, EXPENSE, DISCOUNT |
| Policy Key | Required, text identifier |
| Value | Required, text value |
| Policy Grade | Optional, grade specification |
| Violation Action | Required, action type |
| Is Active | Required, boolean |

---

## API Integration

### Base Configuration

- **Base URL**: `http://localhost:8000`
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token

### Error Handling

| HTTP Status | Behavior |
|-------------|----------|
| 401 | Clear tokens, redirect to `/login` |
| 400 | Display validation error message |
| 403 | Display permission denied message |
| 404 | Display not found message |
| 500 | Display server error message |

### API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register/` | User registration |
| POST | `/api/auth/login/` | User login |
| POST | `/api/auth/logout/` | User logout |
| GET | `/api/auth/me/` | Get current user |
| GET | `/api/approval/requests/` | List requests |
| GET | `/api/approval/requests/:id/` | Get request details |
| POST | `/api/approval/leave/` | Create leave request |
| POST | `/api/approval/expense/` | Create expense request |
| POST | `/api/approval/discount/` | Create discount request |
| PUT | `/api/approval/requests/:id/` | Update request |
| DELETE | `/api/approval/requests/:id/` | Delete request |
| POST | `/api/approval/requests/:id/action/` | Approve/Reject request |
| POST | `/api/approval/requests/:id/flag/` | Flag/Unflag request |
| GET | `/api/approval/policies/` | List policies |
| GET | `/api/approval/policies/:id/` | Get policy details |
| POST | `/api/approval/policies/` | Create policy |
| PUT | `/api/approval/policies/:id/` | Update policy |
| DELETE | `/api/approval/policies/:id/` | Delete policy |
| GET | `/api/approval/admin/analytics/summary/` | Get analytics |

---

## State Management

### Server State (TanStack React Query)

All API data is managed through TanStack React Query with the following configuration:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});
```

### Query Keys

| Key | Description |
|-----|-------------|
| `['requests', options]` | Request list with filters |
| `['request', id]` | Individual request |
| `['policies']` | Policy list |
| `['policy', id]` | Individual policy |
| `['analytics', filters]` | Analytics data |

### Client State (React Context)

Authentication state is managed via `AuthContext`:

- `user`: Current user object or null
- `isLoading`: Loading state for auth operations
- `isAuthenticated`: Boolean authentication status
- `login()`: Function to set tokens and user
- `logout()`: Function to clear session
- `refreshUser()`: Function to re-fetch user data