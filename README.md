# Tour Review System

A comprehensive full-stack application built with Next.js, Node.js, PostgreSQL, and Prisma. Features role-based access control (RBAC), authentication, and a complete admin panel for managing users, organizations, projects, tours, and comments.

## Features

### Authentication & Authorization
- **Complete Auth System**: Login, register, forgot password, email verification, invitation system
- **Role-Based Access Control (RBAC)**: Four user roles with specific permissions
  - Super Admin: Full system access
  - System User: CRUD operations on all models
  - Organization Manager: Manage their organizations and projects
  - Reviewer: Access invited projects and manage comments

### Models & Relationships
- **User**: Authentication and profile management
- **Organization**: Group management with managers and members
- **Project**: Belongs to organizations, can have multiple reviewers
- **Tour**: Different versions per project with one current tour
- **Comment**: Threaded comments on tours with replies
- **Invitation**: Email-based invitation system for project reviewers

### Admin Interface
- Modern, responsive admin dashboard
- CRUD operations for all models with proper RBAC
- Real-time search and pagination
- User management with role assignment
- Organization and project management
- Tour versioning and comment moderation

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Prisma** ORM
- **JWT** authentication
- **Nodemailer** for emails
- **Bcrypt** for password hashing
- **Express-validator** for validation
- **Rate limiting** and security middleware

### Frontend
- **Next.js 15** with React 19
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for API calls
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone and Install
```bash
cd my-auth-app
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/auth_app_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# Email (Gmail example)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# App URLs
APP_URL="http://localhost:3000"
API_URL="http://localhost:5000"
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on port 3000
npm run dev:backend   # Backend on port 5000
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Prisma Studio: `npm run db:studio`

## Default Login Credentials

After seeding, you can log in with these test accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Super Admin | admin@example.com | admin123 | Full system access |
| System User | system@example.com | admin123 | CRUD all models |
| Org Manager | manager@example.com | admin123 | Manage own organizations |
| Reviewer | reviewer@example.com | admin123 | Review invited projects |

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/accept-invitation` - Accept invitation

### Users (Protected)
- `GET /api/users` - List users (Admin only)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Organizations (Protected)
- `GET /api/organizations` - List organizations
- `GET /api/organizations/:id` - Get organization details
- `POST /api/organizations` - Create organization (Admin only)
- `PUT /api/organizations/:id` - Update organization (Admin only)
- `DELETE /api/organizations/:id` - Delete organization (Admin only)
- `POST /api/organizations/:id/members` - Add member
- `DELETE /api/organizations/:id/members/:userId` - Remove member

### Projects (Protected)
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/reviewers` - Add reviewer
- `DELETE /api/projects/:id/reviewers/:userId` - Remove reviewer

### Tours (Protected)
- `GET /api/tours` - List tours
- `GET /api/tours/:id` - Get tour details
- `POST /api/tours` - Create tour (Admin only)
- `PUT /api/tours/:id` - Update tour (Admin only)
- `DELETE /api/tours/:id` - Delete tour (Admin only)

### Comments (Protected)
- `GET /api/comments?tourId=:id` - List comments for tour
- `GET /api/comments/:id` - Get comment details
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Invitations (Protected)
- `GET /api/invitations` - List invitations
- `GET /api/invitations/:id` - Get invitation details
- `POST /api/invitations` - Send invitation
- `PUT /api/invitations/:id` - Update invitation (Admin only)
- `DELETE /api/invitations/:id` - Delete invitation (Admin only)
- `POST /api/invitations/:id/resend` - Resend invitation

## Permission Matrix

| Resource | Super Admin | System User | Org Manager | Reviewer |
|----------|-------------|-------------|-------------|----------|
| Users | CRUD | CRUD | Read | Read (self) |
| Organizations | CRUD | CRUD | Read (own) | Read (member) |
| Projects | CRUD | CRUD | CRUD (own org) | Read (invited) |
| Tours | CRUD | CRUD | Read | Read |
| Comments | CRUD | CRUD | CRUD | CRUD (own) |
| Invitations | CRUD | CRUD | Create/Read (own) | Read (own) |

## Database Schema

The application uses a PostgreSQL database with the following main tables:
- `users` - User accounts and authentication
- `organizations` - Organization management
- `organization_members` - Many-to-many relationship
- `projects` - Project data
- `project_reviewers` - Many-to-many relationship
- `tours` - Tour versions and data
- `comments` - Threaded comments system
- `invitations` - Email invitation system

## Development

### Database Operations
```bash
# Reset database
npm run db:migrate -- --reset

# Deploy migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

### Code Structure
```
my-auth-app/
├── server/
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── utils/          # Email utilities
│   ├── prisma/         # Database schema & seed
│   └── server.js       # Express server
├── src/
│   └── app/            # Next.js app directory
│       ├── login/      # Auth pages
│       ├── signup/
│       ├── dashboard/  # Protected pages
│       └── admin/      # Admin interface
└── package.json
```

## Production Deployment

1. Set environment variables for production
2. Build the application: `npm run build`
3. Deploy database migrations: `npm run db:migrate`
4. Start the application: `npm start`

## Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Helmet.js security headers
- Input validation and sanitization
- SQL injection prevention with Prisma
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
