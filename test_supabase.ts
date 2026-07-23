import { supabase } from './lib/supabase.js';

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
