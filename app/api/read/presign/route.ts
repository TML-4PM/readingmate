export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = 'troylatter-sydney-downloads'

export async function POST(req: NextRequest) {
  const { capture_id, running_record_id, reader_id, content_type } = await req.json()

  if (!capture_id || !running_record_id || !reader_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const ext = content_type === 'audio/mp4' ? 'mp4' : 'webm'
  const s3_key = `reading-buddy/audio/${reader_id}/${capture_id}.${ext}`

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3_key,
    ContentType: content_type || 'audio/webm',
  })
  const presigned_url = await getSignedUrl(s3, command, { expiresIn: 600 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  await supabase.from('rb_audio_capture').insert({
    capture_id,
    reader_id,
    running_record_id,
    s3_key,
    s3_bucket: BUCKET,
    file_format: ext,
    capture_surface: 'web',
    capture_os: req.headers.get('user-agent')?.includes('iPad') ? 'ios'
              : req.headers.get('user-agent')?.includes('Android') ? 'android' : 'web',
    processing_status: 'PENDING',
  })

  return NextResponse.json({ presigned_url, s3_key, capture_id })
}
