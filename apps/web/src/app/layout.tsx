import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../context/ToastContext';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ToastContainer } from '../components/layout/Toast';
import { GlowCursor } from '@karma/ui';

export const metadata: Metadata = {
  title: 'Karma — Your work, compounding.',
  description: 'Career compounding engine with dynamic graph event ingestion, ATS resumes, proof mockups, and BYOK vault.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <ToastProvider>
          <AuthProvider>
            <AppProvider>
              <GlowCursor color="rgba(99, 102, 241, 0.12)" size={400} />
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>
              <ToastContainer />
            </AppProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
