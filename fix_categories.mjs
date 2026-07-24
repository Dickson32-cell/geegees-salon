import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

async function test() {
    const patchRes = await fetch(`${supabaseUrl}/rest/v1/services?category=eq.Hair%20Styling`, {
        method: 'PATCH',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ category: 'Styling' })
    });
    const patchData = await patchRes.json();
    console.log('PATCH response:', patchData);
}

test();
