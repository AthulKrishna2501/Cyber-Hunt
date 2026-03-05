import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Cyber Hunt',
  description: 'Cyber Security Hackathon Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased font-display`}>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          {children}
        </div>
        <Toaster position="bottom-right"
          toastOptions={{
            style: {
              background: '#101122',
              color: '#fff',
              border: '1px solid #6467f250',
            }
          }}
        />
      </body>
    </html>
  );
}
