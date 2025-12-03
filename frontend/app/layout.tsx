'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import './globals.css';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <SocketProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: '12px',
                    padding: '16px',
                  },
                }}
              />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

