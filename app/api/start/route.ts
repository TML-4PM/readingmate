import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, name, childName, plan } = body

  if (!email || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!url || !key) {
    console.error('Reading Buddy: missing Supabase env vars')
    // Still return success — don't block the user
    return NextResponse.json({ success: true, mode: 'degraded' })
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  try {
    const { data, error } = await supabase
      .from('cap_leads')
      .insert({
        biz_key: 'reading-buddy',
        source: 'reading-buddy-signup',
        lead_type: plan || 'freemium',
        full_name: name,
        email,
        message: childName ? `Child: ${childName}` : null,
        landing_page: '/signup',
        consent_terms: true,
        raw_payload: body,
      })
      .select('id')
      .single()

    if (error) throw error

    // Telemetry
    await supabase.from('or_event_log').insert({
      event_name: 'rb_signup',
      page_path: '/signup',
      lead_id: data?.id,
      event_payload: { plan, biz_key: 'reading-buddy' },
    })

    return NextResponse.json({ success: true, lead_id: data?.id })
  } catch (err: unknown) {
    console.error('Reading Buddy signup error:', err)
    // Best-effort fallback: still return success
    return NextResponse.json({ success: true, mode: 'fallback' })
  }
}
