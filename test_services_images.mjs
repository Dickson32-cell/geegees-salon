import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

async function test() {
    const getRes = await fetch(`${supabaseUrl}/rest/v1/services?select=id,name,category,image_url`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    const services = await getRes.json();

    const withImages = services.filter(s => s.image_url);
    console.log('Services with images:', JSON.stringify(withImages, null, 2));
}

test();
