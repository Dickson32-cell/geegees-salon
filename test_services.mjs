import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

async function test() {
    const getRes = await fetch(`${supabaseUrl}/rest/v1/services?select=id,name,category`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    const services = await getRes.json();

    const categories = {};
    services.forEach(s => {
        if (!categories[s.category]) categories[s.category] = [];
        categories[s.category].push(s.name);
    });

    fs.writeFileSync('services.json', JSON.stringify(categories, null, 2), 'utf8');
}

test();
