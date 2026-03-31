'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [schoolsOpen, setSchoolsOpen] = useState(false)

  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'white', borderBottom:'1px solid #e8e2d9', padding:'0 1.5rem' }}>
      <div style={{ maxWidth:1160, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
        <Link href="/" style={{ fontFamily:'Fraunces, serif', fontSize:'1.3rem', fontWeight:700, color:'#4a7c59', textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          📖 Reading Buddy
        </Link>

        <ul style={{ display:'flex', gap:'1.5rem', alignItems:'center', listStyle:'none', margin:0, padding:0 }} className="rb-desktop-nav">
          <li><Link href="/features" style={{ fontSize:'0.9rem', color:'#5a5a5a', textDecoration:'none' }}>Features</Link></li>
          <li style={{ position:'relative' }}
            onMouseEnter={() => setSchoolsOpen(true)}
            onMouseLeave={() => setSchoolsOpen(false)}>
            <span style={{ fontSize:'0.9rem', color:'#5a5a5a', cursor:'pointer' }}>Schools ▾</span>
            {schoolsOpen && (
              <div style={{ position:'absolute', top:'100%', left:0, background:'white', border:'1px solid #e8e2d9', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.1)', padding:'0.5rem', minWidth:180, zIndex:200 }}>
                <Link href="/schools/public" style={{ display:'block', padding:'0.5rem 0.75rem', fontSize:'0.875rem', color:'#1a1a1a', textDecoration:'none', borderRadius:6 }}>Public Schools</Link>
                <Link href="/schools/private" style={{ display:'block', padding:'0.5rem 0.75rem', fontSize:'0.875rem', color:'#1a1a1a', textDecoration:'none', borderRadius:6 }}>Private Schools</Link>
              </div>
            )}
          </li>
          <li><Link href="/ndis" style={{ fontSize:'0.9rem', color:'#5a5a5a', textDecoration:'none' }}>NDIS</Link></li>
          <li><Link href="/about" style={{ fontSize:'0.9rem', color:'#5a5a5a', textDecoration:'none' }}>About</Link></li>
          <li><Link href="/#compare" style={{ fontSize:'0.9rem', color:'#5a5a5a', textDecoration:'none' }}>Pricing</Link></li>
          <li><Link href="/contact" style={{ fontSize:'0.9rem', color:'#5a5a5a', textDecoration:'none' }}>Contact</Link></li>
          {/* ── Teacher tools ── */}
          <li>
            <Link href="/read" style={{ fontSize:'0.85rem', color:'#4a7c59', fontWeight:700, textDecoration:'none', border:'1.5px solid #4a7c59', borderRadius:20, padding:'0.3rem 0.85rem', display:'flex', alignItems:'center', gap:4 }}>
              🎙️ Record
            </Link>
          </li>
          <li>
            <Link href="/teacher" style={{ fontSize:'0.85rem', color:'#5a5a5a', textDecoration:'none' }}>Dashboard</Link>
          </li>
          <li>
            <Link href="mailto:readingbuddy@outcome-ready.com" style={{ background:'#4a7c59', color:'white', padding:'0.55rem 1.25rem', borderRadius:50, fontWeight:600, fontSize:'0.875rem', textDecoration:'none' }}>
              Get Started
            </Link>
          </li>
        </ul>

        <button onClick={() => setOpen(!open)} style={{ background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer', color:'#1a1a1a' }} className="rb-mobile-btn">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div style={{ background:'white', borderTop:'1px solid #e8e2d9', padding:'1rem 1.5rem' }}>
          {[
            ['/features','Features'],
            ['/schools/public','Public Schools'],
            ['/schools/private','Private Schools'],
            ['/ndis','NDIS'],
            ['/about','About'],
            ['/#compare','Pricing'],
            ['/contact','Contact'],
            ['/read','🎙️ Record a Reading'],
            ['/teacher','Teacher Dashboard'],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ display:'block', padding:'0.6rem 0', fontSize:'0.95rem', color: href === '/read' ? '#4a7c59' : '#1a1a1a', fontWeight: href === '/read' ? 700 : 400, textDecoration:'none', borderBottom:'1px solid #f0ebe3' }}>
              {label}
            </Link>
          ))}
          <Link href="mailto:readingbuddy@outcome-ready.com"
            style={{ display:'block', marginTop:'1rem', background:'#4a7c59', color:'white', padding:'0.75rem', borderRadius:8, fontWeight:600, textAlign:'center' as const, textDecoration:'none' }}>
            Get Started
          </Link>
        </div>
      )}

      <style>{`
        @media(min-width:900px){.rb-mobile-btn{display:none!important}}
        @media(max-width:899px){.rb-desktop-nav{display:none!important}}
      `}</style>
    </nav>
  )
}
