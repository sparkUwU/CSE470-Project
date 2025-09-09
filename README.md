# CSE470 Project Website

A comprehensive project management system for students and faculty with project submission, approval, and evaluation features.

MADE BY ALAMGIR HASAN TANZID (ID: 24341188) 

## Features

### 🔐 Authentication & User Management
- Student signup/login (self-registration)
- Faculty login (admin-created accounts only)
- Profile management and password updates
- Role-based access control

### 📚 Student Features
- Submit project ideas with custom feature checklists
- Edit and delete project submissions
- Track project progress with visual progress bars
- Submit final project links
- View final marks and feedback

### 👨‍🏫 Faculty Features
- Review and approve/reject student project ideas
- Add feedback and assign marks (0-20 scale)
- Post announcements visible to all students
- View all student projects and submissions
- Search students by name or student ID

### 🎨 UI/UX Features
- Dark/Light mode toggle
- Responsive design with Tailwind CSS
- Modern, clean interface
- Instant search functionality

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies
- **Database**: MongoDB Atlas

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Git

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd CSE470-Project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend (.env file)
Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cse470?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5000
```

#### Frontend
Create `frontend/.env.local` (optional):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Create Faculty User
```bash
cd backend
npm run seed
```

This creates a faculty user:
- **Email**: faculty@cse470.com
- **Password**: admin123
- **Role**: faculty

### 4. Start Development Servers

#### Backend
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

#### Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Projects
- `POST /api/projects` - Submit project idea
- `GET /api/projects` - Get user's projects
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/all` - Get all projects (faculty)
- `PUT /api/projects/approve/:id` - Approve/reject project
- `PUT /api/projects/feedback/:id` - Add feedback/marks
- `PUT /api/projects/final` - Submit final project
- `GET /api/projects/final-marks` - Get final marks
- `PUT /api/projects/:id/features/:index` - Toggle feature completion

### Users
- `GET /api/users/search` - Search students
- `PUT /api/users/me` - Update profile

### Announcements
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Create announcement (faculty)
- `DELETE /api/announcements/:id` - Delete announcement (faculty)

## Project Structure

```
CSE470-Project/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── seed.js          # Database seeding
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # App entry point
│   └── package.json
└── README.md
```

## Usage

### For Students
1. Sign up with your details
2. Submit project ideas with feature lists
3. Track progress by checking off completed features
4. Submit final project links when approved
5. View final marks and feedback

### For Faculty
1. Login with faculty credentials
2. Review student project submissions
3. Approve/reject projects
4. Add feedback and assign marks
5. Post announcements
6. Monitor student progress

## Development

### Adding New Features
1. Create/update models in `backend/models/`
2. Add controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Create frontend components in `frontend/src/`
5. Add routes to `frontend/src/App.jsx`

### Database Changes
- Update Mongoose schemas
- Run `npm run seed` to reset test data
- Update API endpoints as needed

## Deployment

### Backend (Render/Vercel)
1. Set environment variables
2. Deploy with `npm start`
3. Update CORS origin in `server.js`

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production backend
2. Build with `npm run build`
3. Deploy build folder

### MongoDB Atlas
1. Create cluster
2. Set up database user
3. Get connection string
4. Update `MONGO_URI` in backend

## Troubleshooting

### Common Issues
- **CORS errors**: Check backend CORS origin matches frontend URL
- **JWT errors**: Verify `JWT_SECRET` is set
- **MongoDB connection**: Check `MONGO_URI` format and network access
- **Port conflicts**: Change `PORT` in backend `.env`

### Reset Database
```bash
cd backend
npm run seed
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is for educational purposes as part of CSE470 coursework.

## Support

For issues or questions:
1. Check this README
2. Review error logs
3. Verify environment setup
4. Contact course instructor
