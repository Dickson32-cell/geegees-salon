import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

async function test() {
    const getRes = await fetch(`${supabaseUrl}/rest/v1/services?select=id,name,image_url,updated_at&order=updated_at.desc&limit=5`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    const services = await getRes.json();
    console.log('Recently updated services:', JSON.stringify(services, null, 2));
}

test();
