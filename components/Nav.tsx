import Link from 'next/link'

export default function Nav() {
  return (
    <nav style={{ background:'#1E2A3A', padding:'0 5%', height:58, display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:'1.3rem' }}>📖</span>
        <Link href="/" style={{ fontWeight:800, fontSize:'1rem', color:'white', textDecoration:'none' }}>ReadingMate</Link>
        <span style={{ fontSize:'0.65rem', background:'#F59E0B', color:'#1E2A3A', padding:'2px 7px', borderRadius:20, fontWeight:700 }}>BETA</span>
      </div>
      <div style={{ display:'flex', gap:20, alignItems:'center' }}>
        <Link href="/read" style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', textDecoration:'none', fontWeight:600 }}>My reading</Link>
        <Link href="/progress" style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', textDecoration:'none', fontWeight:600 }}>Progress</Link>
        <Link href="/certs" style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', textDecoration:'none', fontWeight:600 }}>Certificates</Link>
        <Link href="/signup" style={{ background:'#0D9488', color:'white', padding:'7px 16px', borderRadius:6, fontWeight:700, fontSize:'0.82rem', textDecoration:'none' }}>Get started</Link>
      </div>
    </nav>
  )
}
