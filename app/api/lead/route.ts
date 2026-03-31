import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const PLAN_SEGMENT_MAP: Record<string, string> = {
  freemium: 'Classroom', premium_monthly: 'Classroom', premium_annual: 'Classroom',
  school: 'School-wide', free: 'Classroom', premium: 'Classroom',
  enterprise: 'School-wide', ndis: 'Clinic', demo: 'Classroom',
}

async function writeToNotion(full_name: string, email: string, organisation: string, role: string, plan: string, state: string, notes: string) {
  const NOTION_KEY = process.env.NOTION_KEY
  const NOTION_DB_ID = process.env.NOTION_RB_DB_ID
  if (!NOTION_KEY || !NOTION_DB_ID) return
  const segment = PLAN_SEGMENT_MAP[plan] ?? 'Classroom'
  await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${NOTION_KEY}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ parent: { database_id: NOTION_DB_ID }, properties: {
      'Contact Name': { title: [{ text: { content: full_name || email } }] },
      'Email': { email }, 'Organisation': { rich_text: [{ text: { content: organisation } }] },
      'Segment': { select: { name: segment } }, 'Status': { select: { name: 'Lead' } },
      'First Contact Date': { date: { start: new Date().toISOString().split('T')[0] } },
      'Notes': { rich_text: [{ text: { content: notes } }] },
    }}),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 })
  const supabase = createClient(url, key)

  const full_name = body.full_name ?? (body.first_name ? `${body.first_name} ${body.last_name ?? ''}`.trim() : null) ?? body.name ?? null
  const email: string = body.email ?? ''
  const organisation: string = body.organisation ?? body.org ?? body.company ?? ''
  const role: string = body.role ?? body.role_title ?? ''
  const plan: string = body.plan ?? body.lead_type ?? ''
  const state: string = body.state ?? ''
  const message: string = body.message ?? ''

  // Dedupe key
  const campaignSlug = body.utm_campaign ?? 'outrd-rdbuddy-w1'
  const dedupeRaw = `${email}::${campaignSlug}`
  const dedupeKey = Buffer.from(dedupeRaw).toString('base64').replace(/=/g, '').substring(0, 64)

  const payload = {
    biz_key: 'OUTRD',
    campaign: campaignSlug,
    utm_campaign: campaignSlug,
    utm_source: body.utm_source ?? 'reading-buddy-website',
    utm_medium: body.utm_medium ?? 'web',
    utm_term: body.utm_term ?? null,
    utm_content: body.utm_content ?? null,
    offer_code: body.offer_code ?? 'RDBUDDY-TRIAL',
    source: body.source ?? 'reading-buddy-website',
    lead_type: plan || 'free',
    full_name, email,
    phone: body.phone ?? null,
    company: organisation || null,
    role_title: role || null,
    message: message || null,
    landing_page: body.landing_page ?? '/signup',
    consent_terms: !!body.consent_terms,
    consent_marketing: !!body.consent_marketing,
    dedupe_key: dedupeKey,
    raw_payload: body,
  }

  const { data, error } = await supabase.from('cap_leads').insert(payload).select('id').single()
  if (error) {
    if (error.code === '23505') return NextResponse.json({ ok: true, duplicate: true })
    console.error('cap_leads insert error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  try { await writeToNotion(full_name ?? email, email, organisation, role, plan, state, message) } catch {}

  return NextResponse.json({ ok: true, lead_id: data?.id })
}
