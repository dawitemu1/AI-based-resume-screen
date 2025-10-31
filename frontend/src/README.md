# AI-Powered Recruitment Frontend

This is the frontend for the AI-Powered Recruitment platform, built with React and Vite.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API service functions
├── utils/          # Utility functions
├── assets/         # Static assets
├── styles/         # CSS stylesheets
└── README.md       # This file
```

## Authentication System

The application implements a role-based authentication system with two user types:

1. **Admin** - Full access to all system features
2. **User** - Limited access to interview tools

### Demo Credentials

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

### Authentication Flow

1. Users navigate to the login page
2. Users enter their credentials
3. On successful authentication, users are redirected to their respective dashboards
4. Navigation is role-based, with protected routes ensuring users can only access authorized pages

### Key Components

- **AuthContext** - Manages authentication state and provides login/logout functions
- **ProtectedRoute** - Wrapper component that restricts access to routes based on user role
- **Navigation** - Dynamic navigation that shows different options based on user role

## Admin Features

- User management (create, update, delete users)
- System settings configuration
- Report generation and download
- System overview dashboard
- User activity monitoring

## User Features

- Interview tools access
- Profile management
- Interview history review
- Practice mode

## Custom Hooks

- **useAuth** - Access authentication state and functions
- **usePermissions** - Check user permissions and roles
- **useAlert** - Manage alert notifications
- **useForm** - Handle form state and validation (to be implemented)

## Utility Functions

- **api.js** - Axios instance with authentication interceptors
- **errorUtils.js** - Error handling and formatting
- **roleUtils.js** - Role-based access control functions
- **userUtils.js** - User data manipulation functions
- **validationUtils.js** - Input validation functions

## Development

To run the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```

## Components Overview

### Authentication Components
- **LoginPage** - User authentication interface
- **ProtectedRoute** - Route protection based on user roles

### Layout Components
- **Navigation** - Main navigation bar
- **ErrorBoundary** - Error handling wrapper
- **LoadingSpinner** - Loading state indicator

### Dashboard Components
- **AdminDashboard** - Admin main dashboard
- **UserDashboard** - User main dashboard
- **DashboardOverview** - Role-specific dashboard overview
- **UserProfile** - User profile display
- **RoleInfo** - User role information
- **UserAvatar** - User avatar with initials

### Utility Components
- **Alert** - Notification messages
- **ValidatedForm** - Form with validation
- **SystemStatus** - System status indicator
- **UserActivityLog** - Admin user activity log
- **InterviewHistory** - User interview history

### Data Management Components
- **AdminUserManagement** - User management interface
- **AdminSettings** - System settings configuration
- **AdminReports** - Report generation and viewing
- **NotFound** - 404 error page

## Styling

The application uses CSS modules for styling with a consistent design system:

- **Color Palette**: 
  - Primary: #4B0082 (CBE Purple)
  - Secondary: #F8F4FF (Light purple tint)
  - Text: #4B2E00 (CBE Brown)
  - Accent: #A67C00 (Gold accent)
  - Success: #10b981 (green)
  - Error: #ef4444 (red)
  - Admin: #dc2626 (red)
  - User: #059669 (green)

- **Responsive Design**: Mobile-first approach with responsive grid layouts

- **Component Library**: Custom components with consistent styling patterns