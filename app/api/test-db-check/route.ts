import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: inquiries, error: inqError } = await supabase.from('inquiries').select('*').limit(1);
    const { data: contact, error: contactError } = await supabase.from('contact_messages').select('*').limit(1);

    return NextResponse.json({
        inquiries: { data: inquiries, error: inqError?.message },
        contact_messages: { data: contact, error: contactError?.message }
    });
}
