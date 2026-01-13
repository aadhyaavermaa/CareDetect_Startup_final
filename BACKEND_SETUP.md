# CareDetect Backend Setup

## Quick Start

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Start the Backend Server
```bash
npm run dev
```
The server will run on http://localhost:3001

### 3. Start the Frontend (in a new terminal)
```bash
cd ..
npm start
```
The frontend will run on http://localhost:3000

## Features

✅ **User Authentication**
- Sign up with email and password
- Login with validation
- JWT token-based authentication
- Secure password hashing with bcrypt

✅ **User Profile Management**
- Update user profile information
- Store risk assessment results
- Track screening history

✅ **Data Storage**
- File-based JSON storage (for development)
- Easy to migrate to real database later

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Data
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/risk-assessment` - Save risk assessment
- `POST /api/user/screening-result` - Save screening result
- `GET /api/user/screening-history` - Get screening history

## Test the Backend

1. **Health Check**: Visit http://localhost:3001/api/health
2. **Create Account**: Use the signup form in the frontend
3. **Login**: Use the login form in the frontend

## Production Setup

For production, replace the file-based storage with a real database:
- MongoDB with Mongoose
- PostgreSQL with Prisma
- MySQL with Sequelize

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Add rate limiting
- Add input validation middleware
- Use environment variables for sensitive data

## Troubleshooting

**Port 3001 already in use?**
```bash
# Kill process on port 3001
npx kill-port 3001
```

**CORS issues?**
- Make sure backend is running on port 3001
- Check REACT_APP_API_URL in .env file

**Authentication not working?**
- Check browser console for errors
- Verify API endpoints are responding
- Check network tab in browser dev tools