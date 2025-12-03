# Node.js MySQL API Project

A RESTful API built with Node.js, Express, and MySQL.

## Features

- ✅ Express.js server
- ✅ MySQL database connection with connection pooling
- ✅ RESTful API endpoints (CRUD operations)
- ✅ Environment variable configuration
- ✅ CORS enabled
- ✅ Error handling

## Prerequisites

- Node.js (v14 or higher)
- MySQL database hosted on Railway (or another cloud provider)

## MySQL Database Setup

This project uses **Railway** for MySQL database hosting.

1. **Create a MySQL service on Railway:**
   - Sign up at: https://railway.app
   - Create a new MySQL service
   - Get connection details from service settings

2. **Connection Options:**
   - Use **MYSQL_URL** (full connection string): `mysql://user:password@host:port/database`
   - Or use individual variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

**Important:** Use the **PUBLIC** hostname from Railway (not `mysql.railway.internal`) for local development.

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your Railway MySQL credentials:**
   ```env
   # Option 1: Use full connection URL (recommended)
   MYSQL_URL=mysql://user:password@host:port/database
   
   # Option 2: Use individual variables
   # DB_HOST=your-railway-host.railway.app
   # DB_PORT=3306
   # DB_USER=root
   # DB_PASSWORD=your_password_here
   # DB_NAME=railway
   
   PORT=3000
   ```

4. **Initialize database schema:**
   ```bash
   npm run init-db
   ```
   
   This will connect to your Railway database and create all necessary tables.

## Running the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/` - API information
- **GET** `/api/health` - Check server and database status

### Users API
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
  ```
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

## Testing the API

You can use tools like:
- **Postman**
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Browser** (for GET requests)

### Example curl commands:

**Get all users:**
```bash
curl http://localhost:3000/api/users
```

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'
```

**Get user by ID:**
```bash
curl http://localhost:3000/api/users/1
```

**Update user:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","age":25}'
```

**Delete user:**
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Project Structure

```
nodejs_project/
├── config/
│   └── database.js      # Database connection configuration
├── routes/
│   └── users.js         # User API routes
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env                 # Environment variables (create from .env.example)
└── README.md           # This file
```

## Troubleshooting

**Database connection error:**
- Verify Railway MySQL service is running and accessible
- Check `.env` file has correct Railway credentials
- Ensure you're using PUBLIC hostname (not `mysql.railway.internal`)
- Verify database exists in Railway
- Check Railway service logs for connection issues

**Port already in use:**
- Change `PORT` in `.env` file
- Or stop the process using port 3000

## License

ISC

