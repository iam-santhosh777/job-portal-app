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
- MySQL database (see setup options below)

## MySQL Database Setup Options

Since you don't have MySQL installed, here are several options:

### Option 1: Docker (Recommended - Easiest)

1. **Install Docker Desktop** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run MySQL in Docker:**
   ```bash
   docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=testdb -p 3306:3306 -d mysql:8.0
   ```

3. **Your connection details:**
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: `rootpassword`
   - Database: `testdb`

### Option 2: Cloud MySQL (Free Tier Available)

**Option A: PlanetScale (Free tier available)**
- Sign up at: https://planetscale.com
- Create a new database
- Get connection string from dashboard

**Option B: Railway (Free tier available)**
- Sign up at: https://railway.app
- Create a new MySQL service
- Get connection details from service settings

**Option C: Aiven (Free tier available)**
- Sign up at: https://aiven.io
- Create MySQL service
- Get connection details

### Option 3: Install MySQL Locally

**Windows:**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and follow the setup wizard
3. Set a root password during installation
4. Start MySQL service from Services panel

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
sudo systemctl enable mysql
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your MySQL credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=testdb
   PORT=3000
   ```

4. **Create database and table:**
   - Connect to your MySQL server
   - Run the SQL script: `database/schema.sql`
   - Or manually create the database and table:
     ```sql
     CREATE DATABASE IF NOT EXISTS testdb;
     USE testdb;
     ```
   - Then run the table creation SQL from `database/schema.sql`

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
├── database/
│   └── schema.sql       # Database schema
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env                 # Environment variables (create from .env.example)
└── README.md           # This file
```

## Troubleshooting

**Database connection error:**
- Verify MySQL is running
- Check `.env` file has correct credentials
- Ensure database exists
- Check firewall settings if using remote database

**Port already in use:**
- Change `PORT` in `.env` file
- Or stop the process using port 3000

## License

ISC

