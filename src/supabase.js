import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pvkcorovigdmiqxibizq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2a2Nvcm92aWdkbWlxeGliaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzAxNjcsImV4cCI6MjEwMjcwNjE2N30.L_XQye96CLrmJqQj0uI_N3CQ5NFOBJyOi2Uz0UdAKTo'

export const supabase = createClient(supabaseUrl, supabaseKey)
