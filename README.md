# Coupon-Management-System

## Overview

The **Coupon-Management-System** is a web application built to manage coupons. This system allows administrators to create, update, redeem, and track the status of coupons. It includes functionality for user authentication, JWT-based login, and a robust set of API endpoints for interacting with coupon data.

This system is built using **Node.js**, **MongoDB**, **React**, and **Material UI (MUI)** for a smooth, modern, and responsive interface.

## Features

- User authentication (JWT-based login)
- Admin panel to manage coupons
- CRUD operations for coupons (Create, Read, Update, Delete)
- Redeem coupons with cooldown functionality
- Filters for available, expired, and used coupons
- Coupon expiration tracking

## Tech Stack

- **Frontend**: React, Material UI (MUI)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs for hashing passwords

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** and **npm** (Node Package Manager)
- **MongoDB** (You can either run MongoDB locally or use a cloud service like MongoDB Atlas)
- **Postman** or **any API testing tool** (optional, but helpful for testing APIs)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Coupon-Management-System.git
cd Coupon-Management-System
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Setup MongoDB

Ensure MongoDB is running locally or set up an account on MongoDB Atlas for cloud hosting.

### 5. Create Environment Variables

Create a `.env` file in the `backend` directory to store sensitive environment variables like:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coupons
JWT_SECRET=your_jwt_secret_key
COOKIE_SECRET=your_cookie_secret_key
```

- `PORT`: Port where your backend will run.
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT.
- `COOKIE_SECRET`: Secret key for setting cookies.

### 6. Run the Application

Start the backend server:

```bash
cd backend
npm start
```

Start the frontend development server:

```bash
cd frontend
npm start
```

The application should now be running. Open your browser and go to `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

## API Documentation

The backend provides several API endpoints for managing coupons and user authentication.

### Authentication API

#### 1. POST `/login`

**Description:** Logs in a user and returns a JWT token upon successful authentication.

**Request Body:**

```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here"
}
```

- If the user credentials are valid, a JWT token is returned.
- The token should be stored in `localStorage` or cookies for subsequent requests.

### Coupon Management API

#### 2. GET `/coupons`

**Description:** Fetches all available coupons from the database.

**Query Parameters:**

- `status`: Optionally filter by coupon status (e.g., Available, Expired, Availed).

**Response:**

```json
[
  {
    "coupon_code": "ABCD1234",
    "create_date": "2025-03-16",
    "expiry_date": "2025-03-17",
    "status": "Available"
  },
  {
    "coupon_code": "XYZ5678",
    "create_date": "2025-03-10",
    "expiry_date": "2025-03-12",
    "status": "Expired"
  }
]
```

#### 3. POST `/coupons`

**Description:** Creates a new coupon.

**Request Body:**

```json
{
  "coupon_code": "NEWCOUPON2025",
  "expiry_date": "2025-03-25"
}
```

**Response:**

```json
{
  "message": "Coupon created successfully"
}
```

#### 4. PUT `/coupons/redeem/:coupon_code`

**Description:** Redeems a coupon. The coupon status is updated to "Availed".

**Parameters:**

- `coupon_code`: The coupon code of the coupon to redeem.

**Response:**

```json
{
  "message": "Coupon redeemed successfully",
  "claimed_by": "192.168.1.1"
}
```

#### 5. GET `/coupons/:coupon_code`

**Description:** Fetch a specific coupon by its coupon code.

**Parameters:**

- `coupon_code`: The coupon code to fetch.

**Response:**

```json
{
  "coupon_code": "NEWCOUPON2025",
  "create_date": "2025-03-16",
  "expiry_date": "2025-03-25",
  "status": "Available"
}
```

## Error Handling

All responses include error handling, such as invalid credentials, missing coupon, or expired coupon.

- `404`: Not found (e.g., coupon not found).
- `400`: Bad request (e.g., invalid data).
- `401`: Unauthorized (e.g., invalid JWT or login failure).
- `500`: Server error (e.g., internal issues).

## Frontend

### Components

- **LoginPage**: Handles user authentication.
- **AdminPage**: Displays the list of coupons and allows coupon management.
- **CouponForm**: Allows creating new coupons and updating existing ones.

### Libraries Used

- React for building the user interface.
- Material UI (MUI) for UI components.
- Axios for making HTTP requests to the backend.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

