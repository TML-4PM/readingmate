// app/components/RewardDisplay.tsx — drop into reading-buddy repo
"use client"
import { useEffect, useState } from 'react'

interface RewardProps {
  stars: 1 | 2 | 3
  streak: number
  newAchievements: string[]
  buddyKey: 'spark' | 'luna' | 'pip' | 'nova'
  onClose: () => void
}

const BUDDY_EMOJI: Record<string, string[]> = {
  spark: ['😐','😊','😄','🥳'],
  luna:  ['🐙','😊','🥰','🎉'],
  pip:   ['🐻','😄','🤩','🥳'],
  nova:  ['🦋','😊','✨','🎊'],
}

const ACHIEVEMENT_DISPLAY: Record<string, { icon:string; title:string; msg:string }> = {
  first_book:  { icon:'🌟', title:'First book!',    msg:'You read your very first book!' },
  '5_books':   { icon:'🎉', title:'Five books!',    msg:'You have read 5 whole books!' },
  '10_books':  { icon:'📜', title:'10 books!',      msg:'Your certificate is ready!' },
  '25_books':  { icon:'🏆', title:'25 books!',      msg:'Your bookshelf is full!' },
  streak_3:    { icon:'🔥', title:'3 days in a row!',msg:'Reading 3 days running!' },
  streak_7:    { icon:'🔥🔥', title:'Super reader!', msg:'7 days in a row — amazing!' },
  all_3_stars: { icon:'⭐⭐⭐', title:'Perfect!',  msg:'3 stars — your best yet!' },
}

export default function RewardDisplay({ stars, streak, newAchievements, buddyKey, onClose }: RewardProps) {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 50) }, [])

  const buddyFace = BUDDY_EMOJI[buddyKey]?.[stars] ?? '😊'

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, backdropFilter:'blur(4px)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:'white', borderRadius:24, padding:'36px 32px', maxWidth:380, width:'90%', textAlign:'center',
          boxShadow:'0 24px 64px rgba(0,0,0,0.2)', transform: show ? 'scale(1)' : 'scale(0.8)', opacity: show ? 1 : 0, transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Buddy reaction */}
        <div style={{ fontSize:'5rem', marginBottom:8, lineHeight:1, animation:'bounce 0.6s ease' }}>{buddyFace}</div>
        <div style={{ fontFamily:'Fredoka One,cursive', fontSize:'1rem', color:'#7A8099', marginBottom:20 }}>
          {buddyKey.charAt(0).toUpperCase() + buddyKey.slice(1)} says...
        </div>

        {/* Stars */}
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:20 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ fontSize:'2.5rem', filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.25)',
              transform: s <= stars ? 'scale(1)' : 'scale(0.8)', transition:`all 0.4s ${s*0.15}s` }}>⭐</div>
          ))}
        </div>

        <div style={{ fontFamily:'Fredoka One,cursive', fontSize:'1.4rem', color:'#1A2340', marginBottom:6 }}>
          {stars === 3 ? 'Amazing!' : stars === 2 ? 'Great reading!' : 'Good effort!'}
        </div>

        {/* Streak */}
        {streak > 1 && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#FFF3E0', border:'1.5px solid #F5A623', borderRadius:40, padding:'6px 16px', marginBottom:16 }}>
            <span style={{ fontSize:'1.1rem' }}>🔥</span>
            <span style={{ fontWeight:700, fontSize:'0.85rem', color:'#B36A00' }}>{streak} day streak!</span>
          </div>
        )}

        {/* Achievements */}
        {newAchievements.length > 0 && (
          <div style={{ marginBottom:16 }}>
            {newAchievements.map(a => {
              const d = ACHIEVEMENT_DISPLAY[a]
              if (!d) return null
              return (
                <div key={a} style={{ background:'#F0FFF4', border:'1.5px solid #4CAF50', borderRadius:12, padding:'10px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:'1.4rem' }}>{d.icon}</span>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontWeight:800, fontSize:'0.82rem', color:'#1A2340' }}>{d.title}</div>
                    <div style={{ fontSize:'0.75rem', color:'#4a6b52' }}>{d.msg}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button onClick={onClose} style={{ background:'#2BB5A0', color:'white', border:'none', borderRadius:40, padding:'12px 32px', fontFamily:'Fredoka One,cursive', fontSize:'1.1rem', cursor:'pointer', boxShadow:'0 4px 0 #1E8C7A', width:'100%' }}>
          Keep reading! 📚
        </button>
      </div>
    </div>
  )
}
