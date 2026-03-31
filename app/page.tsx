"use client"
import { useState } from 'react'
import Link from 'next/link'

const C = {
  slate: '#1E2A3A', slateM: '#2D3F55', slateL: '#4A6080',
  amber: '#D97706', amberL: '#F59E0B', amberBg: '#FFFBEB',
  warm: '#F8F5F0', warmD: '#EDE8E0', cream: '#FDFCFA',
  text: '#1A2030', muted: '#5A6A7A', border: '#DDD8D0',
  teal: '#0D9488', tealL: '#14B8A6',
}

const MODES = [
  { id:'adult',      label:'Adult Literacy',   icon:'📄', desc:'Build everyday reading confidence — forms, notices, news', cefr:false },
  { id:'esl',        label:'ESL / EAL',         icon:'🌏', desc:'English as a second language — A1 to B1+, CEFR aligned',   cefr:true  },
  { id:'pensioner',  label:'Mature Learner',    icon:'☀️', desc:'Large text, no time pressure, health & community focus',  cefr:false },
  { id:'vocational', label:'Vocational / RTO',  icon:'🔧', desc:'Workplace reading, Certificate I–III entry, LLN evidence',cefr:false },
]

const CERTS = [
  { icon:'📋', title:'Progress Certificate',    who:'Learner & tutor',       desc:'Sessions, levels moved, WPM trend' },
  { icon:'🏛️', title:'AMEP Evidence Log',       who:'TAFE / migration provider', desc:'CEFR attained, hours logged, goal progress' },
  { icon:'🎯', title:'NDIS Functional Literacy', who:'NDIS provider & planner', desc:'Goal-referenced, timestamped, audit-ready' },
  { icon:'🏗️', title:'RTO LLN Evidence Pack',   who:'RTO assessor',          desc:'Pre-training assessment + practice log' },
  { icon:'🏡', title:'Aged Care Activity Log',  who:'Facility & family',     desc:'Engagement score, carer notes, ACFI ready' },
]

const VALUE = [
  { cohort:'AMEP student',      without:'$4–8k/yr tutor time',       with:'$29/mo individual' },
  { cohort:'NDIS participant',  without:'$80–150/hr speech pathology',with:'$59/mo — same evidence' },
  { cohort:'Aged care facility',without:'$30–50/hr staff logging',   with:'$199/mo auto-log' },
  { cohort:'RTO pre-entry LLN', without:'$200–400 per assessment',   with:'Included in $590/yr' },
]

export default function ReadingMatePage() {
  const [activeMode, setActiveMode] = useState<string|null>(null)

  return (
    <div style={{ fontFamily:'system-ui,-apple-system,sans-serif', background:C.warm, color:C.text, minHeight:'100vh' }}>

      {/* NAV */}
      <nav style={{ background:C.slate, padding:'0 5%', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:'1.4rem' }}>📖</span>
          <span style={{ fontWeight:800, fontSize:'1.1rem', color:'white', letterSpacing:'-0.3px' }}>ReadingMate</span>
          <span style={{ fontSize:'0.7rem', background:C.amberL, color:C.slate, padding:'2px 8px', borderRadius:20, fontWeight:700, marginLeft:4 }}>BETA</span>
        </div>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          {['How it works','Pricing','Evidence'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', textDecoration:'none', fontWeight:600 }}>{l}</a>
          ))}
          <Link href="/signup" style={{ background:C.amber, color:'white', padding:'8px 18px', borderRadius:6, fontWeight:700, fontSize:'0.85rem', textDecoration:'none' }}>Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding:'80px 5% 64px', maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
        <div>
          <div style={{ display:'inline-block', background:C.amberBg, border:`1.5px solid ${C.amberL}`, color:C.amber, fontSize:'0.78rem', fontWeight:700, padding:'5px 14px', borderRadius:20, marginBottom:20, letterSpacing:'0.5px' }}>
            🇦🇺 Built for Australia · AMEP · NDIS · RTO · Aged Care
          </div>
          <h1 style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:'-0.5px' }}>
            Build your reading.<br />
            <span style={{ color:C.teal }}>At your pace.</span><br />
            With evidence that counts.
          </h1>
          <p style={{ fontSize:'1.05rem', color:C.muted, lineHeight:1.7, marginBottom:32, maxWidth:480 }}>
            AI-powered reading coach for adults, ESL learners, mature readers, and vocational students.
            Every session generates progress evidence for tutors, providers, and funding bodies.
          </p>
          <div style={{ display:'flex', gap:12 }}>
            <Link href="/signup" style={{ background:C.teal, color:'white', padding:'13px 28px', borderRadius:8, fontWeight:700, fontSize:'0.95rem', textDecoration:'none', boxShadow:'0 4px 0 #0A7A70' }}>Start free</Link>
            <Link href="/how-it-works" style={{ border:`2px solid ${C.border}`, color:C.muted, padding:'13px 24px', borderRadius:8, fontWeight:600, fontSize:'0.95rem', textDecoration:'none' }}>See how it works</Link>
          </div>
        </div>

        {/* Mode picker card */}
        <div style={{ background:'white', borderRadius:16, padding:'28px 24px', border:`1.5px solid ${C.border}`, boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', color:C.muted, marginBottom:14 }}>Who is this for?</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {MODES.map(m => (
              <div key={m.id} onClick={() => setActiveMode(activeMode===m.id ? null : m.id)}
                style={{ padding:'14px 16px', borderRadius:10, border:`2px solid ${activeMode===m.id ? C.teal : C.border}`, background: activeMode===m.id ? '#F0FDFB' : '#FAFAF9', cursor:'pointer', transition:'all 0.15s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom: activeMode===m.id ? 6 : 0 }}>
                  <span style={{ fontSize:'1.2rem' }}>{m.icon}</span>
                  <span style={{ fontWeight:700, fontSize:'0.9rem', color: activeMode===m.id ? C.teal : C.text }}>{m.label}</span>
                  {m.cefr && <span style={{ fontSize:'0.65rem', background:'#EEF2FF', color:'#4338CA', padding:'2px 7px', borderRadius:10, fontWeight:700 }}>CEFR</span>}
                  <span style={{ marginLeft:'auto', fontSize:'0.9rem', color:C.muted }}>{activeMode===m.id ? '▲' : '▼'}</span>
                </div>
                {activeMode===m.id && (
                  <p style={{ fontSize:'0.8rem', color:C.muted, lineHeight:1.6, margin:0 }}>{m.desc}</p>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop:16 }}>
            <Link href={`/signup${activeMode ? `?mode=${activeMode}` : ''}`}
              style={{ display:'block', textAlign:'center', background: activeMode ? C.teal : C.slateL, color:'white', padding:'12px', borderRadius:8, fontWeight:700, fontSize:'0.9rem', textDecoration:'none', transition:'background 0.2s' }}>
              {activeMode ? `Start as ${MODES.find(m=>m.id===activeMode)?.label} →` : 'Choose a mode to start →'}
            </Link>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <div style={{ background:C.teal, padding:'20px 5%', display:'flex', justifyContent:'center', gap:60, flexWrap:'wrap' }}>
        {[['0','Manual marking'],['100%','Funding-body ready evidence'],['5','Certificate types'],['A1–B1+','CEFR aligned']].map(([n,l]) => (
          <div key={l} style={{ textAlign:'center' }}>
            <div style={{ fontWeight:900, fontSize:'1.5rem', color:'white' }}>{n}</div>
            <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.75)' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* CERTS */}
      <section id="evidence" style={{ padding:'72px 5%', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', color:C.amber, marginBottom:10 }}>The moat</div>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, marginBottom:12 }}>Five certificates. Zero admin.</h2>
          <p style={{ color:C.muted, maxWidth:520, margin:'0 auto', fontSize:'0.95rem', lineHeight:1.7 }}>
            No existing reading app generates evidence for Australian funding bodies. This is the product.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
          {CERTS.map(cert => (
            <div key={cert.title} style={{ background:'white', borderRadius:12, padding:'20px', border:`1.5px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:10 }}>{cert.icon}</div>
              <div style={{ fontWeight:800, fontSize:'0.88rem', color:C.text, marginBottom:4 }}>{cert.title}</div>
              <div style={{ fontSize:'0.72rem', color:C.amber, fontWeight:700, marginBottom:8 }}>{cert.who}</div>
              <div style={{ fontSize:'0.78rem', color:C.muted, lineHeight:1.6 }}>{cert.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE TABLE */}
      <section style={{ padding:'0 5% 72px', maxWidth:900, margin:'0 auto' }}>
        <h2 style={{ fontWeight:900, fontSize:'1.4rem', marginBottom:24 }}>Cost/benefit by cohort</h2>
        <div style={{ border:`1.5px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', background:C.slate, padding:'12px 20px' }}>
            {['Cohort','Without ReadingMate','With ReadingMate'].map(h => (
              <div key={h} style={{ fontSize:'0.72rem', fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:'rgba(255,255,255,0.7)' }}>{h}</div>
            ))}
          </div>
          {VALUE.map((row, i) => (
            <div key={row.cohort} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', padding:'14px 20px', background: i%2===0 ? 'white' : C.warm, borderTop:`1px solid ${C.border}` }}>
              <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{row.cohort}</div>
              <div style={{ fontSize:'0.85rem', color:'#DC2626' }}>{row.without}</div>
              <div style={{ fontSize:'0.85rem', color:C.teal, fontWeight:700 }}>{row.with}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C.slate, padding:'40px 5%', color:'rgba(255,255,255,0.6)', fontSize:'0.8rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div>
            <span style={{ fontWeight:800, color:'white' }}>ReadingMate</span> by Tech 4 Humanity Pty Ltd · ABN 70 666 271 272
          </div>
          <div style={{ display:'flex', gap:20 }}>
            <a href="https://reading-buddy-lac.vercel.app" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>Reading Buddy (Kids)</a>
            <a href="https://outcome-ready.com" style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none' }}>OutcomeReady</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
