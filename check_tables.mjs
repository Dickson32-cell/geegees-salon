import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('inquiries').select('*').limit(1);
    if (error) console.log('inquiries error:', error.message);
    else console.log('inquiries table exists!');

    const { data: d2, error: e2 } = await supabase.from('contact_messages').select('*').limit(1);
    if (e2) console.log('contact_messages error:', e2.message);
    else console.log('contact_messages table exists!');
}
check();
