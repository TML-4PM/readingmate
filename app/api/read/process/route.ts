export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'

const lambda = new LambdaClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  const { capture_id, running_record_id, reader_id, s3_key, book_text, duration_ms } = await req.json()

  if (!capture_id || !running_record_id || !s3_key || !book_text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const payload = { action: 'process_audio', capture_id, running_record_id, s3_key, book_text, duration_ms: duration_ms || 0 }

  try {
    await lambda.send(new InvokeCommand({
      FunctionName: 'rb-audio-processor',
      InvocationType: 'Event',
      Payload: JSON.stringify(payload),
    }))
  } catch (err) {
    console.error('Lambda invoke error:', err)
    return NextResponse.json({ error: 'Failed to trigger processing' }, { status: 500 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  await supabase.from('rb_audio_capture')
    .update({ processing_status: 'PROCESSING', duration_ms })
    .eq('capture_id', capture_id)

  return NextResponse.json({ ok: true, status: 'processing', capture_id })
}
