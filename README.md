# Mobile Contacts API

Backend service designed for mobile applications to handle user accounts and contact management. This Express.js-based solution provides secure authentication and contact storage capabilities through a RESTful interface.

## What This API Does

Enables mobile apps to:
- Register new user accounts with email verification
- Authenticate users and maintain secure sessions
- Store and organize personal contact information
- Search through contacts using multiple criteria
- Retrieve paginated contact lists efficiently

## Built With

- **Node.js** - JavaScript runtime
- **Express.js** - HTTP server framework
- **MongoDB** - Document database
- **Mongoose** - Database object modeling
- **JWT** - Session token generation
- **bcryptjs** - Cryptographic password protection
- **express-validator** - Request data validation

## Getting Started

### System Requirements

Ensure you have:
- Node.js version 14 or newer installed
- MongoDB instance running (local or remote)
- npm package manager

### Setup Instructions

**Step 1:** Get the code
```bash
git clone <repository-url>
cd NodeJSAssignment2
```

**Step 2:** Install required packages
```bash
npm install
```

**Step 3:** Configure environment variables
Create a `.env` file by copying the example:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/contactsdb
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Step 4:** Launch MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

**Step 5:** Run the application
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Access the API at `http://localhost:3000` (or your configured port).

## API Reference

### Account Management

#### Register New Account
**Endpoint:** `POST /api/auth/signup`

Send user registration details:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "address": "123 Main St"
}
```

Receive authentication token and user info:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "address": "123 Main St"
    }
  }
}
```

#### Sign In
**Endpoint:** `POST /api/auth/login`

Provide credentials:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Get session token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "address": "123 Main St"
    }
  }
}
```

### User Profile

#### Retrieve Account Information
**Endpoint:** `GET /api/user/details`

Include authentication header: `Authorization: Bearer <token>`

Response includes complete profile:
```json
{
  "success": true,
  "message": "User details retrieved successfully",
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "address": "123 Main St",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Contact Operations

#### Add New Contact
**Endpoint:** `POST /api/contacts`

Requires authentication header: `Authorization: Bearer <token>`

Send contact information:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+9876543210",
  "address": "456 Oak Ave",
  "country": "USA"
}
```

Created contact returned:
```json
{
  "success": true,
  "message": "Contact created successfully",
  "data": {
    "contact": {
      "id": "contact-id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+9876543210",
      "address": "456 Oak Ave",
      "country": "USA",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Fetch All Contacts
**Endpoint:** `GET /api/contacts`

Requires authentication header: `Authorization: Bearer <token>`

Optional query parameters:
- `page` - Page number (starts at 1)
- `limit` - Results per page (default: 10)

Response format:
```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": {
    "contacts": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalContacts": 50,
      "limit": 10
    }
  }
}
```

#### Find Contacts
**Endpoint:** `GET /api/contacts/search`

Requires authentication header: `Authorization: Bearer <token>`

Search parameters (any combination):
- `name` - Match contact name
- `email` - Match email address
- `phone` - Match phone number
- `page` - Page number
- `limit` - Results per page

Example request: `/api/contacts/search?name=Jane&phone=987`

Response includes matching contacts:
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "contacts": [...],
    "searchParams": {
      "name": "Jane",
      "phone": "987"
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalContacts": 2,
      "limit": 10
    }
  }
}
```

## Protection Mechanisms

The API implements several security measures:
- Passwords encrypted with bcrypt before storage
- JWT tokens for stateless authentication
- All input validated before processing
- Error messages don't reveal system internals
- Cross-origin requests configured via CORS
- Sensitive values stored in environment variables

## Error Responses

When something goes wrong, the API returns structured error information:
```json
{
  "success": false,
  "message": "Error message here"
}
```

HTTP status codes used:
- `200` - Operation completed
- `201` - Resource created
- `400` - Invalid request data
- `401` - Authentication needed
- `404` - Resource not found
- `500` - Server error occurred

## Code Organization

```
NodeJSAssignment2/
├── controllers/          # Business logic handlers
│   ├── authController.js
│   ├── contactController.js
│   └── userController.js
├── middleware/            # Request processing
│   └── auth.js
├── models/               # Database schemas
│   ├── Contact.js
│   └── User.js
├── routes/               # URL routing
│   ├── auth.js
│   ├── contacts.js
│   └── user.js
├── utils/                # Helper functions
│   └── jwt.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Testing the API

Use any HTTP client to interact with endpoints. Recommended tools:
- Postman
- cURL command line
- Thunder Client (VS Code extension)
- Insomnia

### Quick Test Examples

**Create account:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Authenticate:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Add contact (use token from login):**
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Jane Smith","phone":"+9876543210","email":"jane@example.com"}'
```

## License

ISC
