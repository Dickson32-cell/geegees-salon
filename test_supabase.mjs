import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: appointments, error: getError } = await supabase.from('appointments').select('*').limit(1);
    if (getError) {
        console.log('GET error:', getError);
        return;
    }

    if (appointments && appointments.length > 0) {
        const id = appointments[0].id;
        console.log('Updating appointment', id);
        const { data, error } = await supabase
            .from('appointments')
            .update({ status: 'confirmed' })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.log('PATCH error:', error);
        } else {
            console.log('PATCH success:', data);
        }
    } else {
        console.log('No appointments found');
    }
}

test();
