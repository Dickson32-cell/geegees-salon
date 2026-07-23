import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Attempting to insert test appointment...');
    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                service: 'Test Service',
                stylist: 'Test Stylist',
                appointment_date: new Date().toISOString(),
                appointment_time: '10:00 AM',
                customer_name: 'Test Customer',
                customer_email: 'test@example.com',
                customer_phone: '1234567890',
                notes: 'Test notes',
                status: 'pending'
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Insert failed with error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Insert succeeded! Data:', data);
    }
}

testInsert();
