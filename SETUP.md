# Shabbar Project - Setup Guide

This guide will help you set up and run the comprehensive authentication and admin system.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Email account for sending emails (Gmail recommended)

## Installation

1. **Clone and install dependencies**
   ```bash
   cd my-auth-app
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/shabbar_db"

   # JWT Secret (generate a random string)
   JWT_SECRET="your-super-secret-jwt-key-here"

   # Application URL
   APP_URL="http://localhost:3000"

   # Server Port
   PORT=5000

   # Email Configuration
   EMAIL_FROM="noreply@yourapp.com"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Node Environment
   NODE_ENV="development"

   # Next.js API URL
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed the database with sample data
   npm run db:seed
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1: Start the backend
   npm run dev:backend

   # Terminal 2: Start the frontend
   npm run dev:frontend
   ```

## Test Accounts

After seeding the database, you can use these test accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | Super Admin |
| system@example.com | admin123 | System User |
| manager@example.com | admin123 | Organization Manager |
| reviewer@example.com | admin123 | Reviewer |

## Features

### Authentication System
- ✅ User registration with email verification
- ✅ Login/logout with JWT cookies
- ✅ Password reset functionality
- ✅ Invitation system for new users
- ✅ Role-based access control (RBAC)

### Admin Dashboard
- ✅ Comprehensive dashboard with statistics
- ✅ User management (CRUD operations)
- ✅ Organization management
- ✅ Project management
- ✅ Tour management with versioning
- ✅ Comment system with threading
- ✅ Invitation management

### Role Permissions

#### Super Admin
- Full CRUD access to all resources
- User management
- System configuration

#### System User
- CRUD operations on all models except users
- Manage organizations, projects, tours, comments

#### Organization Manager
- Manage own organizations and projects
- Invite reviewers to projects
- CRUD operations on tours and comments within their organization

#### Reviewer
- Access only to invited projects
- CRUD operations on own comments
- View tours within assigned projects

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/accept-invitation` - Accept invitation
- `GET /api/auth/me` - Get current user

### Resource Endpoints
All endpoints require authentication and implement RBAC:

- `/api/users` - User management
- `/api/organizations` - Organization management
- `/api/projects` - Project management
- `/api/tours` - Tour management
- `/api/comments` - Comment management
- `/api/invitations` - Invitation management

## Development Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start Next.js frontend only
npm run dev:backend      # Start Express backend only

# Database
npm run db:migrate       # Run Prisma migrations
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## Project Structure

```
my-auth-app/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── dashboard/       # Admin dashboard pages
│   │   ├── login/          # Authentication pages
│   │   └── signup/
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   └── lib/               # Utility functions
├── server/
│   ├── routes/            # Express routes
│   ├── middleware/        # Authentication & RBAC middleware
│   ├── utils/             # Server utilities
│   └── prisma/            # Database schema and migrations
└── public/               # Static assets
```

## Security Features

- Password hashing with bcrypt
- JWT tokens stored in HTTP-only cookies
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention via Prisma
- CORS protection
- Helmet security headers
- Role-based access control

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists and user has permissions

### Email Not Sending
- Check email credentials in .env.local
- For Gmail, use App Passwords instead of regular password
- Ensure "Less secure app access" is enabled or use OAuth2

### Port Already in Use
- Change PORT in .env.local
- Kill existing processes: `killall node`
- Use different ports for frontend/backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 