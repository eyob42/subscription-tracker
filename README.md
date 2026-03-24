# 📦 Subscription Tracker API

A production-ready Subscription Management System API built with Node.js, Express, and MongoDB. It helps users track, manage, and receive automated reminders for their subscriptions before they renew.

---

## 🚀 Features

### 🔐 Authentication & Security

-JWT-based authentication (Signup/Login)

-Password hashing with bcrypt

-Protected routes with authorization middleware

-Rate limiting & bot protection (Arcjet)

### 📦 Subscription Management

-Complete CRUD operations for subscriptions

-Automatic renewal date calculation

-Subscription status tracking (active/canceled/expired)

-Category & frequency classification

### ⏰ Automated Reminders

-Upstash Workflow integration for reliable scheduling

-Configurable reminder days (7, 5, 2, 1 days before renewal)

-Email notifications via Nodemailer

-Workflows survive server restarts and failures

### 🗄️ Data Modeling

-MongoDB with Mongoose ODM

-User & Subscription schemas with validation

-Automatic timestamps (createdAt, updatedAt)

-Population for related data

### 📧 Email System

-HTML email templates

-Customizable reminder messages

-Error handling with retries

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcryptjs
- **Security:** Arcjet (Bot detection, Rate limiting)
- **Background Jobs:** Upstash QStash / Workflow
- **Email:** Nodemailer
- **Utilities:** dayjs (date handling), dotenv (environment variables)

---

## 📂 Project Structure

subscription-tracker/
├── config/ # Configuration files
│ ├── env.js # Environment variables
│ └── nodemailer.js # Email transporter setup
├── controllers/ # Business logic
│ ├── auth.controller.js
│ ├── subscription.controller.js
│ └── user.controller.js
├── middlewares/ # Custom middleware
│ └── auth.middleware.js # JWT verification
├── models/ # Database models
│ ├── user.model.js
│ └── subscription.model.js
├── routes/ # API routes
│ ├── auth.routes.js
│ ├── subscription.routes.js
│ └── user.routes.js
├── utils/ # Utility functions
│ ├── send-email.js # Email service
│ └── email-template.js # Email templates
├── workflows/ # Upstash workflows
│ └── reminder.workflow.js
├── app.js # Express app setup
└── package.json

```


---
```

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/eyob42/subscription-tracker.git
cd subscription-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3.🔑 Environment Variables

Create a.env.development.localfile in the root:
PORT=5500
SERVER_URL=http://localhost:5500

NODE_ENV=development

# Server Configuration

PORT=5500
SERVER_URL=http://localhost:5500
NODE_ENV=development

# Database

DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/subscription-tracker

# JWT Authentication

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Arcjet Security

ARCJET_KEY=your_arcjet_api_key
ARCJET_ENV=development

# Upstash QStash

QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=your_qstash_token

# Email (Gmail App Password required)

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

Important: For Gmail, use an App Password, not your regular password. Enable 2FA first.

### 4.▶️ Running the App

# Terminal 1 - Express Server:

npm run dev

# Terminal 2 - Upstash Workflow (Local Development):

npx @upstash/qstash-cli dev

### 5.📡 API Endpoints

Method Endpoint Description
POST /api/v1/auth/sign-up Create a new user account
POST /api/v1/auth/sign-in Login and receive JWT token
POST /api/v1/auth/sign-out Logout (client-side token removal)

Subscriptions
Method Endpoint Description Auth Required
GET /api/v1/users/:id Get user profile ✅
PUT /api/v1/users/:id Update user profile ✅
DELETE /api/v1/users/:id Delete user account ✅

Method Endpoint Description Auth Required
GET /api/v1/subscriptions Get all user subscriptions ✅
GET /api/v1/subscriptions/:id Get single subscription ✅
POST /api/v1/subscriptions Create a new subscription ✅
PUT /api/v1/subscriptions/:id Update subscription ✅
DELETE /api/v1/subscriptions/:id Cancel/delete subscription ✅

### 6.🧪 Example Request

# 🔐 Sign Up

POST /api/v1/auth/sign-up
Content-Type: application/json

# Request Body:

{
"name": "John Doe",
"email": "john@example.com",
"password": "securepassword123"
}

# Response:

json
{
"success": true,
"message": "User created successfully",
"data": {
"token": "eyJhbGciOiJIUzI1NiIs...",
"user": {
"\_id": "67d8f4b2c3a5e81234567890",
"name": "John Doe",
"email": "john@example.com",
"createdAt": "2025-03-20T10:30:00.000Z"
}
}
}

# 📦 Create Subscription

POST /api/v1/subscriptions
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

# Request Body:

json
{
"name": "Netflix Premium",
"price": 15.99,
"currency": "USD",
"frequency": "monthly",
"category": "entertainment",
"paymentMethod": "Credit Card",
"startDate": "2025-03-20"
}

# Response:

json
{
"success": true,
"data": {
"\_id": "67d8f4b2c3a5e81234567891",
"name": "Netflix Premium",
"price": 15.99,
"currency": "USD",
"frequency": "monthly",
"category": "entertainment",
"paymentMethod": "Credit Card",
"status": "active",
"startDate": "2025-03-20T00:00:00.000Z",
"renewalDate": "2025-04-19T00:00:00.000Z",
"user": "67d8f4b2c3a5e81234567890",
"createdAt": "2025-03-20T10:30:00.000Z",
"updatedAt": "2025-03-20T10:30:00.000Z"
}
}

# 🧪 Testing with Postman

Import the collection (if available)

Create a user via /api/v1/auth/sign-up

Login to get your JWT token

Set the token in Postman Authorization tab as Bearer Token

Create subscriptions and watch for email reminders

# 📌 How Automated Reminders Work

1,User creates a subscription → Workflow triggered

2,Workflow calculates renewal date and reminder schedule

3,Sleeps until 7 days before renewal

4,Sends email reminder at 7, 5, 2, and 1 day(s) before

5,Updates status to expired if renewal date passes

# 🔒 Environment Variables Reference

Variable Description Required Example
PORT Server port ✅ 5500
SERVER*URL Public server URL ✅ http://localhost:5500
NODE_ENV Environment mode ✅ development or production
DB_URI MongoDB connection string ✅ mongodb+srv://...
JWT_SECRET JWT signing secret ✅ your-secret-key
JWT_EXPIRES_IN Token expiration ✅ 7d
ARCJET_KEY Arcjet API key ✅ aj_key*...
ARCJET_ENV Arcjet environment ✅ development
QSTASH_URL QStash URL ✅ http://127.0.0.1:8080
QSTASH_TOKEN QStash authentication ✅ Your token
EMAIL_USER Email account ✅ your@gmail.com
EMAIL_PASS App password ✅ 16-char password

# 🐛 Troubleshooting

Common Issues & Solutions
Issue Solution
MongoDB connection failed Check IP whitelist in Atlas; add your IP or 0.0.0.0/0
JWT verification fails Ensure JWT_SECRET matches when signing and verifying
Emails not sending Use Gmail App Password; check spam folder
Workflow not triggering Run npx @upstash/qstash-cli dev in separate terminal
Arcjet blocking requests Set ARCJET_ENV=development for testing

# 📊 Database Schema Overview

## User Model

{
name: String (required),
email: String (required, unique),
password: String (required, hashed),
createdAt: Date,
updatedAt: Date
}

## Subscription Model

{
name: String (required),
price: Number (required),
currency: [USD, EUR, GBP],
frequency: [daily, weekly, monthly, yearly],
category: String (required),
paymentMethod: String (required),
status: [active, canceled, expired],
startDate: Date (required),
renewalDate: Date,
user: ObjectId (ref: 'User'),
createdAt: Date,
updatedAt: Date
}

{
"name": "Netflix",
"price": 139,
"currency": "USD",
"frequency": "monthly",
"category": "Entertainment",
"startDate": "2025-01-20",
"paymentMethod": "Credit Card"
}

📌 Future Improvements
. 📊 Dashboard (Frontend)
. 📱 Mobile notifications
. 💳 Payment integrations
. 📈 Analytics & reports
. 🎨 Custom email templates

🤝 Contributing

Pull requests are welcome.
For major changes, open an issue first.

📄 License

MIT License

👨‍💻 Author

Eyob Lingerih

.GitHub: @eyob42
