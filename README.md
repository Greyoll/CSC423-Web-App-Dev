# Valdez Medical Portal

A comprehensive medical portal web application built with React and Node.js that enables patients, doctors, and admins to manage appointments and user accounts.

## Features

### For Patients
- View upcoming appointments
- Access appointment history
- Schedule new appointments
- Update personal settings
- Toggle dark mode theme

### For Doctors
- View patient appointments
- Access patient records
- Monitor upcoming schedules
- Manage profile settings

### For Administrators
- Full user management (create, read, update, delete)
- Appointment management and oversight
- System-wide analytics and monitoring
- Complete access control

### General Features
- JWT-based authentication
- Role-based access control
- Dark mode / Light mode toggle
- Responsive design
- Secure password hashing
- Real-time appointment tracking

## Tech Stack

### Frontend
- React  
- React Router  
- Vite (build tool)  
- CSS  
- JavaScript  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose 
- JWT (JSON Web Tokens)  
- Bcrypt (password hashing)  

### Development Tools
- Nodemon (server auto-reload)  
- Concurrently (run multiple processes)  
- ESLint (code linting)  

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js 
- npm 
- MongoDB 

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Greyoll/CSC423-Web-App-Dev.git
cd CSC423-Web-App-Dev
```

### Step 2: Install All Dependencies
```bash
npm run install-all
```

Alternatively, install dependencies separately:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client/portalReact
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@csc423db.cojz2xx.mongodb.net/CSC423DBMain?retryWrites=true&w=majority&appName=CSC423-DB
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

**Note:** Make sure the `.env` file is placed in the `server` folder (not in the root directory).

## Running the Application

### Development Mode (Recommended)

Run both the server and client simultaneously:

```bash
npm run dev
```

This will start:
- **Backend Server**: http://localhost:3000
- **Frontend Client**: http://localhost:5173

### Running Separately

Start the server only:
```bash
node server/index.js
```

Start the client only (from `client/portalReact` directory):
```bash
npm run dev
```



## Project Structure

```
valdez-medical-portal/
├── server/
│   ├── controllers/
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── appointmentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── tokenValidator.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── client/
│   └── portalReact/
│       ├── public/
│       │   ├── Images/
│       │   └── vite.svg
│       ├── src/
│       │   ├── auth/
│       │   │   └── Login.jsx
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── Sidebar.jsx
│       │   ├── context/
│       │   │   ├── AuthContext.jsx
│       │   │   └── ThemeContext.jsx
│       │   ├── hooks/
│       │   │   └── useLogin.js
│       │   ├── pages/
│       │   │   ├── DashboardPatient.jsx
│       │   │   ├── DashboardDoctor.jsx
│       │   │   ├── DashboardAdmin.jsx
│       │   │   ├── AppointmentViewPatient.jsx
│       │   │   ├── AppointmentViewDoctor.jsx
│       │   │   ├── AppointmentViewAdmin.jsx
│       │   │   ├── UserManagementViewAdmin.jsx
│       │   │   └── Settings.jsx
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── index.jsx
│       ├── package.json
│       └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Appointments
- `GET /api/appointments/:user` - Get appointments for a user
- `POST /api/appointments` - Create new appointment (admin only)
- `PUT /api/appointments/:id` - Update appointment (admin only)
- `DELETE /api/appointments/:id` - Delete appointment (admin only)

## Authentication

The application uses JWT (JSON Web Tokens) for secure authentication. When a user logs in:

1. The server validates credentials
2. A JWT token is generated and returned
3. The token is stored in localStorage
4. The token is included in subsequent API requests

Tokens expire after 1 hour and contain encoded user information (id, username, role, name).

## User Roles

### Patient
- View personal appointments
- Access appointment history
- Update profile settings
- Cannot manage other users

### Doctor
- View assigned appointments
- Access patient information
- View patient updates
- Cannot create or delete appointments

### Admin
- Full system access
- Manage all users
- Manage all appointments
- Create, edit, and delete users

### Test Credentials

```
ADMIN
Username: cfair4
Password: teamlead

DOCTOR
Username: stan
Password: GMoney527

PATIENT
Username: rfant1
Password: ACMChair
```

## Testing

### Login Flow
1. Navigate to http://localhost:5173/login
2. Enter test credentials from the credentials section above
3. You'll be redirected to the appropriate dashboard based on your role

### Features to Test
- **Patient**: View appointments, access dashboard, toggle dark mode
- **Doctor**: View assigned appointments, access patient information
- **Admin**: Create/edit/delete users, manage appointments, full system access

## Important Notes

- Ensure MongoDB is running before starting the server
- The `.env` file must be in the `server` directory, not the root
- The development server uses CORS to allow requests from http://localhost:5173
- All API requests require a valid JWT token (except /api/auth/login)
- Passwords are hashed using bcrypt before storage

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### MongoDB connection errors
- Verify MongoDB is running
- Check MONGO_URI in .env file
- Ensure the database name is correct

### CORS errors
- Verify the frontend is running on http://localhost:5173
- Check CORS configuration in server/index.js

### Port already in use
```bash
# Change PORT in .env file or kill the process using the port
```

## Support

For issues or questions, please refer to the project repository or contact Collin Fair (CollinF777).

---

**Last Updated:** November 2025  
**Version:** 1.0.0
