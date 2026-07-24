import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

async function run() {
    // We can't run DDL directly via REST API, but we can test if photo_url already exists
    // by attempting to select it
    const res = await fetch(`${supabaseUrl}/rest/v1/team_members?select=id,photo_url&limit=1`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    const data = await res.json();
    if (res.ok) {
        console.log('✅ photo_url column exists! Response:', JSON.stringify(data));
    } else {
        console.log('❌ photo_url column does NOT exist yet. Run ADD_TEAM_PHOTO_URL.sql in Supabase.');
        console.log('Response:', JSON.stringify(data));
    }
}

run();
