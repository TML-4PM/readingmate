"use client"
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

const MODES = [
  { id:'adult',      label:'Adult Literacy',  icon:'📄', levels:['Foundation','Developing','Independent'], langs:false },
  { id:'esl',        label:'ESL / EAL',        icon:'🌏', levels:['A1','A2','B1','B1+'],                   langs:true  },
  { id:'pensioner',  label:'Mature Learner',   icon:'☀️', levels:['Beginner','Comfortable','Confident'],   langs:false },
  { id:'vocational', label:'Vocational / RTO', icon:'🔧', levels:['Pre-entry','Entry','Certificate I'],    langs:false },
]
const ESL_LANGS = ['Arabic','Vietnamese','Cantonese','Mandarin','Hindi','Punjabi','Spanish','Filipino','Somali','Other']

export default function SignupPage() {
  const params = useSearchParams()
  const defaultMode = params.get('mode') || 'adult'
  const [mode, setMode] = useState(defaultMode)
  const [level, setLevel] = useState('')
  const [nativeLang, setNativeLang] = useState('')
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const modeData = MODES.find(m => m.id === mode)!
  const C = { slate:'#1E2A3A', teal:'#0D9488', border:'#DDD8D0', muted:'#5A6A7A', warm:'#F8F5F0' }

  return (
    <div style={{ minHeight:'100vh', background:C.warm, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:520, background:'white', borderRadius:16, padding:'36px 32px', border:`1.5px solid ${C.border}`, boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:'1.5rem', marginBottom:6 }}>📖</div>
          <div style={{ fontWeight:900, fontSize:'1.3rem', color:C.slate }}>ReadingMate</div>
          <div style={{ fontSize:'0.8rem', color:C.muted, marginTop:4 }}>Set up your reading profile</div>
        </div>
        <div style={{ display:'flex', gap:4, marginBottom:28 }}>
          {[1,2,3].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:4, background: s<=step ? C.teal : '#E5E7EB' }} />)}
        </div>
        {step===1 && (
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem', marginBottom:16 }}>What brings you to ReadingMate?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {MODES.map(m => (
                <div key={m.id} onClick={() => setMode(m.id)} style={{ padding:'14px 16px', borderRadius:10, border:`2px solid ${mode===m.id ? C.teal : C.border}`, background: mode===m.id ? '#F0FDFB' : 'white', cursor:'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.15s' }}>
                  <span style={{ fontSize:'1.3rem' }}>{m.icon}</span>
                  <span style={{ fontWeight:700, fontSize:'0.9rem', color: mode===m.id ? C.teal : C.slate }}>{m.label}</span>
                  {mode===m.id && <span style={{ marginLeft:'auto', color:C.teal }}>✓</span>}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{ marginTop:20, width:'100%', background:C.teal, color:'white', padding:'13px', borderRadius:8, border:'none', fontWeight:700, fontSize:'0.95rem', cursor:'pointer' }}>Continue →</button>
          </div>
        )}
        {step===2 && (
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem', marginBottom:6 }}>What is your reading level?</div>
            <div style={{ fontSize:'0.8rem', color:C.muted, marginBottom:16 }}>We will verify this in your first session</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {modeData.levels.map(l => (
                <div key={l} onClick={() => setLevel(l)} style={{ padding:'12px 16px', borderRadius:10, border:`2px solid ${level===l ? C.teal : C.border}`, background: level===l ? '#F0FDFB' : 'white', cursor:'pointer', fontWeight:700, fontSize:'0.88rem', color: level===l ? C.teal : C.slate }}>{l}</div>
              ))}
            </div>
            {modeData.langs && (
              <div style={{ marginTop:16 }}>
                <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:8 }}>Your first language (optional)</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {ESL_LANGS.map(l => (
                    <div key={l} onClick={() => setNativeLang(l)} style={{ padding:'5px 11px', borderRadius:20, border:`1.5px solid ${nativeLang===l ? C.teal : C.border}`, background: nativeLang===l ? '#F0FDFB' : 'white', cursor:'pointer', fontSize:'0.77rem', fontWeight:600, color: nativeLang===l ? C.teal : C.muted }}>{l}</div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={() => setStep(1)} style={{ flex:1, background:'white', color:C.muted, padding:'12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontWeight:600, cursor:'pointer' }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!level} style={{ flex:2, background: level ? C.teal : '#9CA3AF', color:'white', padding:'12px', borderRadius:8, border:'none', fontWeight:700, cursor: level ? 'pointer':'not-allowed' }}>Continue →</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div>
            <div style={{ fontWeight:800, fontSize:'0.95rem', marginBottom:16 }}>Create your account</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[['Your name','text',name,setName,'e.g. Maria'],['Email address','email',email,setEmail as any,'you@email.com']].map(([label,type,val,setter,ph]) => (
                <div key={label as string}>
                  <label style={{ fontSize:'0.8rem', fontWeight:700, color:C.muted, display:'block', marginBottom:5 }}>{label}</label>
                  <input value={val as string} onChange={e => (setter as any)(e.target.value)} type={type as string} placeholder={ph as string} style={{ width:'100%', padding:'11px 14px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:'0.9rem', fontFamily:'inherit' }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, padding:'12px 14px', background:'#F0FDFB', borderRadius:8, border:'1px solid #99F6E4', fontSize:'0.8rem', color:C.muted }}>
              {modeData.label} · {level}{nativeLang ? ` · ${nativeLang}` : ''}
            </div>
            <div style={{ display:'flex', gap:10, marginTop:16 }}>
              <button onClick={() => setStep(2)} style={{ flex:1, background:'white', color:C.muted, padding:'12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontWeight:600, cursor:'pointer' }}>← Back</button>
              <button disabled={!name||!email} style={{ flex:2, background:(name&&email)?C.teal:'#9CA3AF', color:'white', padding:'12px', borderRadius:8, border:'none', fontWeight:700, cursor:(name&&email)?'pointer':'not-allowed' }}>Start Free →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
