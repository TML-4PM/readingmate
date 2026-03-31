import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  icons: {
    icon: 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
    shortcut: 'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  },
  title: 'Reading Buddy — AI Reading Coach for Kids',
  description: 'Your child\'s AI reading coach with real progress reports in days, not months. Assessment, coaching, and school-ready reporting.',
  openGraph: {
    title: 'Reading Buddy — AI Reading Coach',
    description: 'See real reading progress in 48 hours.',
    url: 'https://readingbuddy.ai',
    siteName: 'Reading Buddy',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}<footer style={{borderTop:'1px solid #e8e2d9',padding:'2rem 1.5rem',textAlign:'center',background:'#faf7f2',fontSize:'0.8rem',color:'#888'}}><a href='https://outcome-ready.vercel.app/sweetspots' target='_blank' style={{color:'#4a7c59',textDecoration:'none',fontWeight:600}}>🧠 AI Sweet Spots Research</a> &nbsp;·&nbsp; <a href='https://outcome-ready.vercel.app' target='_blank' style={{color:'#4a7c59',textDecoration:'none'}}>Outcome Ready</a> &nbsp;·&nbsp; © 2026 Tech 4 Humanity Pty Ltd &nbsp;·&nbsp; ABN 70 666 271 272</footer></body>
    </html>
  )
}
