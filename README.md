# 🚀 Full-Stack Project Manager

A modern, production-ready full-stack application for project management with authentication, built with React, Node.js, and PostgreSQL.

## 🌐 Live Deployments

- **Frontend**: [https://fullstack-starter-frontend.vercel.app](https://fullstack-starter-frontend.vercel.app) (Vercel)
- **Backend API**: [https://endearing-heart-production.up.railway.app/api](https://endearing-heart-production.up.railway.app/api) (Railway)

## 📁 Project Structure

```
fullstack-starter/
├── README.md                 # This file
├── client/                   # React frontend
│   ├── README.md            # Frontend documentation
│   ├── src/
│   │   ├── App.tsx          # Main app component
│   │   ├── App.css          # Styling
│   │   ├── services/
│   │   │   └── api.ts       # API client
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                   # Node.js backend
│   ├── README.md            # Backend documentation
│   ├── src/
│   │   ├── index.ts         # Express server
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts      # Authentication endpoints
│   │   │   └── projects.ts  # Project CRUD endpoints
│   │   └── lib/             # Utilities
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json
```

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** with TypeScript
- **Vite** for development and building
- **Axios** for API communication
- **CSS3** with custom styling and gradients
- **Responsive design** for mobile and desktop

### Backend (Server)
- **Node.js** with Express and TypeScript
- **Prisma ORM** for database management
- **PostgreSQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **CORS** configured for cross-origin requests

### Deployment & Infrastructure
- **Vercel** - Frontend hosting with automatic deployments
- **Railway** - Backend API and PostgreSQL database hosting
- **GitHub Actions** - Automatic deployment on push
- **Environment variables** for production configuration

## 🚀 Features

- **User Authentication** - Secure signup/signin with JWT tokens
- **Project Management** - Create, read, update, and delete projects
- **Responsive UI** - Beautiful interface that works on all devices
- **Session Management** - Persistent login state with localStorage
- **Form Validation** - Client and server-side validation
- **Error Handling** - Graceful error messages and loading states
- **Production Ready** - Deployed with proper environment configuration

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/KeriCarpenterProg/fullstack-starter.git
   cd fullstack-starter
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   # Copy .env.example to .env and configure DATABASE_URL
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📚 Documentation

- [Frontend Documentation](./client/README.md) - React app setup, components, and deployment
- [Backend Documentation](./server/README.md) - API endpoints, database schema, and configuration

## 🌟 From Development to Production

This project demonstrates a complete journey from local development to production deployment:

1. **Local Development** - SQLite database for quick setup
2. **Production Migration** - PostgreSQL for scalability and reliability
3. **Environment Parity** - Same database technology in dev and prod
4. **Automated Deployments** - Push to GitHub → Auto-deploy to Vercel/Railway
5. **CORS Configuration** - Proper cross-origin setup for frontend/backend communication

## 🔧 Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:4000/api
```

### Server (.env)
```
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
```

## 🎯 What's Next?

- [ ] Add project sharing and collaboration
- [ ] Implement file uploads
- [ ] Add real-time updates with WebSockets
- [ ] Create admin dashboard
- [ ] Add OAuth integration (Google, GitHub)
- [ ] Implement automated testing

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using modern web technologies**
