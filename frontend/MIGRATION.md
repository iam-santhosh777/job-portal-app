# Migration from React (Vite) to Next.js

This document outlines the migration from React with Vite to Next.js.

## Changes Made

### 1. Project Structure
- **Before**: `src/` directory with `main.tsx` and `App.tsx`
- **After**: `app/` directory with Next.js App Router structure
- Pages are now organized in `app/[route]/page.tsx` format

### 2. Routing
- **Before**: React Router with `BrowserRouter`, `Routes`, and `Route` components
- **After**: Next.js file-based routing in the `app/` directory
- Routes:
  - `/login` → `app/login/page.tsx`
  - `/user/dashboard` → `app/user/dashboard/page.tsx`
  - `/user/jobs` → `app/user/jobs/page.tsx`
  - `/hr/dashboard` → `app/hr/dashboard/page.tsx`
  - `/hr/jobs` → `app/hr/jobs/page.tsx`
  - `/hr/post-job` → `app/hr/post-job/page.tsx`
  - `/hr/applications` → `app/hr/applications/page.tsx`
  - `/hr/resumes` → `app/hr/resumes/page.tsx`

### 3. Environment Variables
- **Before**: `VITE_API_URL` (accessed via `import.meta.env.VITE_API_URL`)
- **After**: `NEXT_PUBLIC_API_URL` (accessed via `process.env.NEXT_PUBLIC_API_URL`)
- Create a `.env.local` file with:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3000/api
  ```

### 4. Navigation
- **Before**: `useNavigate()` and `useLocation()` from `react-router-dom`
- **After**: `useRouter()` and `usePathname()` from `next/navigation`

### 5. Client Components
- All components that use hooks or browser APIs are marked with `'use client'` directive
- Root layout (`app/layout.tsx`) is a client component to include providers

### 6. Route Protection
- **Before**: `ProtectedRoute` component wrapping routes
- **After**: Layout-based protection in `app/user/layout.tsx` and `app/hr/layout.tsx`
- Middleware (`middleware.ts`) handles basic routing (client-side auth is handled in layouts)

### 7. Image Optimization
- **Before**: Regular `<img>` tags
- **After**: Next.js `Image` component from `next/image` for optimized images

### 8. Build Configuration
- **Before**: Vite (`vite.config.ts`)
- **After**: Next.js (`next.config.js`)
- Removed Vite-specific files:
  - `vite.config.ts`
  - `index.html`
  - `src/main.tsx`
  - `src/App.tsx`
  - `tsconfig.app.json`
  - `tsconfig.node.json`

### 9. Scripts
- **Before**: 
  - `npm run dev` (Vite dev server)
  - `npm run build` (Vite build)
- **After**:
  - `npm run dev` (Next.js dev server on port 3000)
  - `npm run build` (Next.js build)
  - `npm run start` (Next.js production server)

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run start
   ```

## Notes

- The backend API remains unchanged - all API calls work the same way
- Authentication still uses localStorage (client-side)
- All components, hooks, and utilities remain in the `src/` directory
- The migration maintains 100% feature parity with the React version

