import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/['"]/g, '');
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

async function test() {
    const getRes = await fetch(`${supabaseUrl}/rest/v1/appointments?select=*&limit=1`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });
    const appointments = await getRes.json();

    if (appointments && appointments.length > 0) {
        const id = appointments[0].id;
        console.log('Updating appointment', id);
        const patchRes = await fetch(`${supabaseUrl}/rest/v1/appointments?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ status: 'confirmed' })
        });
        const patchData = await patchRes.json();
        console.log('PATCH response:', patchData);
    } else {
        console.log('No appointments found');
    }
}

test();
