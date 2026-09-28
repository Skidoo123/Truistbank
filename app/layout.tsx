import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Truist Bank Statement Generator | PDF Export & Financial Ledger',
  description: 'Generate authentic, printable Truist Bank account statements with live interactive calculations, PDF download, and CSV export.',
  icons: {
    icon: '/truist-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0D0614] text-slate-100">{children}</body>
    </html>
  );
}
