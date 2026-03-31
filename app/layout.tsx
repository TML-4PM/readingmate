import type { Metadata } from 'next'
import Nav from '../components/Nav'

export const metadata: Metadata = {
  title: 'ReadingMate — AI Reading Coach for Adults',
  description: 'AI-powered reading coach for adult literacy, ESL learners, mature readers, and vocational students. AMEP, NDIS, and RTO evidence generation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin:0, padding:0, fontFamily:'system-ui,-apple-system,sans-serif' }}>
        <Nav />
        {children}
      </body>
    </html>
  )
}
