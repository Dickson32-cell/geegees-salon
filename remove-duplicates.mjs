import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicates() {
    console.log('Fetching all services...');
    const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching services:', error);
        return;
    }

    console.log(`Found ${services.length} total services.`);

    const seenNames = new Set();
    const duplicates = [];

    for (const service of services) {
        const normalizedName = service.name.trim().toLowerCase();
        if (seenNames.has(normalizedName)) {
            duplicates.push(service);
        } else {
            seenNames.add(normalizedName);
        }
    }

    console.log(`Found ${duplicates.length} duplicate services.`);

    if (duplicates.length === 0) {
        console.log('No duplicates found. Exiting.');
        return;
    }

    console.log('Deleting duplicates...');
    for (const duplicate of duplicates) {
        console.log(`Deleting duplicate: ${duplicate.name} (ID: ${duplicate.id})`);
        const { error: deleteError } = await supabase
            .from('services')
            .delete()
            .eq('id', duplicate.id);

        if (deleteError) {
            console.error(`Failed to delete ${duplicate.name}:`, deleteError);
        } else {
            console.log(`Successfully deleted ${duplicate.name}`);
        }
    }

    console.log('Finished removing duplicates.');
}

removeDuplicates();
