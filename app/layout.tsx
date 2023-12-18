import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CssBaseline from '@mui/material/CssBaseline';



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ball zone App',
  description: 'keep scores for pickup basketball leagues and games ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CssBaseline />
          {children}
          <Analytics />
       </body>
    </html>
  )
}
