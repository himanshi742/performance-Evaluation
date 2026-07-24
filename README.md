# Aura Feedback – Performance Evaluation System

Aura Feedback is a full-stack web application designed to simplify employee performance evaluations within organizations. It provides role-based access for HR, Managers, Founders, and Employees to manage feedback cycles, submit evaluations, and monitor completion status.

## 🚀 Features

### Authentication
- Secure user login using JWT
- Role-based authentication
- Company-based user management

### HR Dashboard
- Create and manage performance evaluation cycles
- Track overall feedback completion
- Monitor pending and completed reviews
- View company-wide evaluation progress

### Manager Dashboard
- View team members assigned for review
- Submit performance feedback
- Track submitted and pending evaluations

### Employee Dashboard
- View assigned feedback status
- Access evaluation information

### Founder Dashboard
- Monitor organization-wide performance reviews
- View direct report evaluations

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- CORS

### Deployment
- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

---

## 📂 Project Structure

```
Performance-Evaluation/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── README.md
```

---

## ⚙ Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/performance-evaluation-system.git
```

Move into the project folder

```bash
cd performance-evaluation-system
```

---

## Backend Setup

Install dependencies

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend

```bash
node server.js
```

---

## Frontend Setup

Install dependencies

```bash
cd frontend
npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:5000
```

Run the frontend

```bash
npm run dev
```

---

## Database Seeding

The project includes a seed script that populates the database with:

- Companies
- HR Admin
- Founder
- Managers
- Employees
- Feedback Cycles
- Sample Feedback Submissions

Run

```bash
node seed.js
```

Default password for all seeded users:

```
PilotPass123!
```

The seed script creates two sample organizations with different reporting structures for testing. :contentReference[oaicite:0]{index=0}

---

## Test Accounts

### Ashoka Textiles

| Role | Email |
|------|-------|
| HR Admin | kavita@ashokatextiles.com |
| Founder | vikram@ashokatextiles.com |
| Manager | rohan@ashokatextiles.com |
| Manager | priya@ashokatextiles.com |
| Employee | team1@ashokatextiles.com |

Password

```
PilotPass123!
```

### Bright Path Consulting

Founder

```
siddharth@brightpath.com
```

Password

```
PilotPass123!
```

---

## API Endpoints

### Authentication

```
POST /api/auth/login
```

### HR

```
GET /api/hr/*
POST /api/hr/*
```

### Manager

```
GET /api/manager/*
POST /api/manager/*
```

### Employee

```
GET /api/employee/*
```

The backend exposes a health check endpoint at:

```
GET /api/health
```

which returns the API status and timestamp. :contentReference[oaicite:1]{index=1}

---

## Deployment

Frontend

- Vercel

Backend

- Vercel Serverless Functions

Database

- MongoDB Atlas

The backend deployment uses a Vercel configuration that routes all requests through `server.js`. :contentReference[oaicite:2]{index=2}

---

## Future Enhancements

- Email notifications
- Performance analytics dashboard
- Export reports to PDF/Excel
- Employee self-assessment
- Peer-to-peer feedback
- Admin analytics
- Multi-company support improvements

---

## Author

**Himanshi Bisht**

GitHub: https://github.com/yourusername

---

## License

This project was developed as part of a hiring assessment and is intended for educational and evaluation purposes.
