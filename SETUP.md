# Domain Management Application - Setup Instructions

A full-stack domain management web application built with React, Node.js, Express, and TypeScript.

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git

## 🚀 Quick Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd domain-management-app

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# JWT Secret
JWT_SECRET=your-jwt-secret-key-here

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# API Ninjas (for WHOIS lookup)
API_NINJAS_KEY=your-api-ninjas-key

# Email Configuration (NodeMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com

# Development
NODE_ENV=development
```

### 3. Get Required API Keys

#### Razorpay (Payment Integration)
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account and verify your business
3. Go to Settings > API Keys
4. Generate test/live keys and add to `.env`

#### API Ninjas (WHOIS Lookup)
1. Visit [API Ninjas](https://api.api-ninjas.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env` as `API_NINJAS_KEY`

#### Email Configuration
1. Use Gmail with App Password:
   - Enable 2FA on your Gmail account
   - Generate an App Password
   - Use your Gmail and App Password in `.env`

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # In-memory data storage
│   └── vite.ts           # Vite development server setup
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── components.json      # shadcn/ui configuration
```

## 🎯 Features

### Core Functionality
- **User Authentication**: JWT-based login/register system
- **Domain Management**: Add, view, edit, delete domains
- **WHOIS Integration**: Automatic domain information lookup
- **Status Tracking**: Active, expiring soon, expired domains
- **Payment System**: Razorpay integration for domain renewals
- **Email Notifications**: Automated expiry reminders
- **Dashboard Analytics**: Domain statistics and charts

### UI/UX Features
- **Modern Design**: Custom Tailwind CSS with gradient themes
- **Responsive Layout**: Mobile-first design approach
- **Dark Mode Ready**: CSS variables for theme switching
- **Interactive Charts**: Domain status visualization
- **Progress Indicators**: Domain expiry countdown
- **Toast Notifications**: User feedback system

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production Build
npm run build        # Build for production
npm start           # Start production server

# Type Checking
npm run type-check   # Run TypeScript compiler
```

## 🗃 Data Storage

The application uses in-memory storage for development. Data includes:
- User accounts with encrypted passwords
- Domain portfolio with expiry tracking
- Payment history and transactions
- Notification system

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Domains
- `GET /api/domains` - List user domains
- `POST /api/domains` - Add new domain
- `PUT /api/domains/:id` - Update domain
- `DELETE /api/domains/:id` - Delete domain

### Dashboard
- `GET /api/dashboard/stats` - Domain statistics

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - Payment history

### Utilities
- `GET /api/whois/:domain` - WHOIS lookup
- `GET /api/notifications` - User notifications

## 🧪 Testing the Application

### 1. Register a New Account
1. Navigate to the registration page
2. Create an account with username, email, password
3. You'll be automatically logged in

### 2. Add Domains
1. Go to "Add Domain" page
2. Enter a domain name (e.g., "example.com")
3. Click "Lookup WHOIS" to fetch domain info
4. Add optional tags and set auto-renewal
5. Save the domain

### 3. View Dashboard
1. Check domain statistics
2. View status distribution charts
3. Monitor expiry notifications

### 4. Test Payments
1. Go to a domain with "Renew" option
2. Click renew to simulate payment
3. Check payment history

## 🔒 Security Notes

- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation with Zod schemas
- CORS protection enabled
- Environment variables for secrets

## 📝 Development Notes

- Built with modern React patterns (hooks, context)
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for component library
- Express.js for backend API
- Drizzle ORM schema definitions

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change port in package.json
2. **API key errors**: Verify all environment variables
3. **Email not sending**: Check SMTP configuration
4. **Payment errors**: Verify Razorpay test keys

### Getting Help

1. Check console logs for errors
2. Verify environment variables are set
3. Ensure all dependencies are installed
4. Check API key permissions and quotas

## 🚀 Deployment

For production deployment:

1. Build the application: `npm run build`
2. Set production environment variables
3. Use a process manager like PM2
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure database (replace in-memory storage)

---

*This application demonstrates modern full-stack development practices with a focus on user experience and scalable architecture.*