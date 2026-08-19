import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pvkcorovigdmiqpibizq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2a2Nvcm92aWdkbWlxeGliaXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMzAxNjcsImV4cCI6MjEwMjcwNjE2N30.L_XQye96CLrmJqQj0uI_N3CQ5NFOBJyOi2Uz0UdAKTo'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Fetching...')
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) {
    console.error('Fetch error:', error)
  } else {
    console.log('Data:', data)
  }
}

test()
