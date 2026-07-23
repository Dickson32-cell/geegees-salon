import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: (url, options = {}) =>
                    fetch(url, { ...options, cache: 'no-store' }),
            },
        }
    );
}

// Helper to get inquiries from website_content
async function getInquiries() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('website_content')
        .select('content')
        .eq('page', 'admin')
        .eq('section', 'inquiries')
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('[API] Error fetching inquiries:', error);
        return [];
    }

    return data?.content?.items || [];
}

// Helper to save inquiries to website_content
async function saveInquiries(items: any[]) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('website_content')
        .upsert(
            {
                page: 'admin',
                section: 'inquiries',
                content: { items },
                updated_at: new Date().toISOString()
            },
            {
                onConflict: 'page,section',
                ignoreDuplicates: false
            }
        );

    if (error) {
        console.error('[API] Error saving inquiries:', error);
        throw error;
    }
}

export async function GET() {
    try {
        const items = await getInquiries();
        return NextResponse.json(items, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const items = await getInquiries();

        // Create new inquiry
        const newInquiry = {
            id: Date.now(),
            name,
            email,
            subject,
            message,
            date: new Date().toISOString().split('T')[0],
            status: 'unread'
        };

        // Add to beginning of list
        items.unshift(newInquiry);

        await saveInquiries(items);

        return NextResponse.json({ success: true, inquiry: newInquiry });
    } catch (error) {
        console.error('[API] POST inquiry error:', error);
        return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const items = await getInquiries();
        const index = items.findIndex((item: any) => item.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }

        items[index].status = status;
        await saveInquiries(items);

        return NextResponse.json({ success: true, inquiry: items[index] });
    } catch (error) {
        console.error('[API] PATCH inquiry error:', error);
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const items = await getInquiries();
        const filteredItems = items.filter((item: any) => item.id.toString() !== id);

        await saveInquiries(filteredItems);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] DELETE inquiry error:', error);
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
    }
}
