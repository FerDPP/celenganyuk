import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pvkcorovigdmiqpibizq.supabase.co'
const supabaseKey = 'sb_publishable_no8XvIuuT-ZsN60mJ2hY6w_9UMQqPIf'

export const supabase = createClient(supabaseUrl, supabaseKey)
