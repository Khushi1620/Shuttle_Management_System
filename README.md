# 🚌 Shuttle Management System

A smart backend system for managing shuttle bookings on a university campus. It supports user authentication, admin controls, trip bookings, digital wallet operations, and more.

---

## 🚀 Features

### ✅ User Authentication
- Register, Login, Logout
- Role-based access control (User/Admin)
- Password reset with email domain restriction (`@glbitm.ac.in`)

### ✅ User Functionalities
- Forgot Password & Reset Password
- Update Profile & View Profile

### ✅ Admin Panel
- Manage Routes (Add / Update / Delete / View)
- Manage Shuttles (Add / Update / Delete / View)
- View all registered users
- Recharge user wallet balance

### ✅ Trip Booking System
- Book a trip (select shuttle, route, date)
- Cancel trip with auto refund
- View trip history

### ✅ Wallet Management
- Auto fare deduction during trip booking
- Admin/User wallet recharge

### ✅ Security
- JWT-based authentication
- Redis for token blacklisting on logout
- Input validation (email, password strength, etc.)

---

## 🧰 Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Backend     | Node.js, Express.js         |
| Database    | MongoDB + Mongoose          |
| Auth        | JWT + Bcrypt                |
| Caching     | Redis (Logout tokens)       |
| Testing     | Postman                     |

---

## 📁 Project Structure


Shuttle_Management_System/
├── index.js                     # Backend start point (root)
├── package.json                 # Backend package file (root)
├── package-lock.json            # Backend lock file (root)
├── .env                        # Environment variables (root)
└── backend/
    ├── controllers/            # Business logic
    │   ├── adminFunctionalities.js
    │   ├── bookingControllers.js
    │   ├── routeFunctionalitiesImplementation.js
    │   ├── shuttleFunctions.js
    │   └── userAuthenticationFunctions.js
    │
    ├── middleware/             # Middleware for auth and roles
    │   ├── adminMiddleware.js
    │   └── userMiddleware.js
    │
    ├── models/                 # Mongoose schemas
    │   ├── booking.js
    │   ├── route.js
    │   ├── shuttle.js
    │   └── user.js
    │
    ├── routes/                 # Express routes
    │   ├── adminRouter.js
    │   ├── authRouter.js
    │   ├── bookingRouter.js
    │   ├── routeRouter.js
    │   └── shuttleRouter.js
    │
    ├── utils/                  # Helper utilities
    │   └── validateUsers.js
    │
    └── config/                 # Configuration files
        ├── mongo.js
        └── redis.js
