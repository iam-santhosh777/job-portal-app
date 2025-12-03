# Job Portal Frontend (Next.js)

A modern Next.js frontend application for the Job Portal system.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Update `.env.local` with your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** If port 3000 is already in use, Next.js will automatically use the next available port (usually 3001).

### Build for Production

```bash
npm run build
npm run start
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── login/            # Login page
│   ├── user/              # User routes
│   │   ├── dashboard/     # User dashboard
│   │   └── jobs/          # User jobs page
│   └── hr/                # HR routes
│       ├── dashboard/     # HR dashboard
│       ├── jobs/          # HR jobs management
│       ├── post-job/      # Post new job
│       ├── applications/  # View applications
│       └── resumes/       # Resume management
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth, Socket)
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and Socket services
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── public/                # Static assets
```

## 🔐 Authentication

The app uses client-side authentication with localStorage:
- Token is stored in `localStorage` as `token`
- User data is stored in `localStorage` as `user`
- Routes are protected via layout components (`app/user/layout.tsx`, `app/hr/layout.tsx`)

## 🌐 Environment Variables

All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser:

- `NEXT_PUBLIC_API_URL` - Backend API base URL (should include `/api` suffix)

## 📦 Key Dependencies

- **Next.js 15** - React framework
- **React 19** - UI library
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Toast notifications

## 🔄 Migration from React (Vite)

This project was migrated from React + Vite to Next.js. See `MIGRATION.md` for details.
