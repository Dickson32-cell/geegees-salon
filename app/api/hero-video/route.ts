import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force this route to always run dynamically - never cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
};

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }),
            },
        }
    );
}

// GET: read the hero video URL directly from the database
export async function GET() {
    try {
        const supabase = getSupabase();

        const { data, error } = await supabase
            .from('website_content')
            .select('content')
            .eq('page', 'home')
            .eq('section', 'hero')
            .maybeSingle();

        if (error) {
            console.error('[hero-video] DB read error:', error.message);
            return NextResponse.json({ heroVideoUrl: null }, { headers: NO_STORE_HEADERS });
        }

        const heroVideoUrl = (data?.content as any)?.heroVideoUrl ?? null;
        console.log('[hero-video] GET → heroVideoUrl:', heroVideoUrl);

        return NextResponse.json({ heroVideoUrl }, { headers: NO_STORE_HEADERS });
    } catch (err: any) {
        console.error('[hero-video] GET error:', err.message);
        return NextResponse.json({ heroVideoUrl: null }, { headers: NO_STORE_HEADERS });
    }
}

// POST: save or update the hero video URL directly in the database
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { heroVideoUrl } = body;

        if (!heroVideoUrl || typeof heroVideoUrl !== 'string') {
            return NextResponse.json({ error: 'heroVideoUrl is required' }, { status: 400, headers: NO_STORE_HEADERS });
        }

        const supabase = getSupabase();

        // First, try to get existing row
        const { data: existing } = await supabase
            .from('website_content')
            .select('content')
            .eq('page', 'home')
            .eq('section', 'hero')
            .maybeSingle();

        // Merge the new heroVideoUrl into the existing content (or create fresh)
        const existingContent = (existing?.content as any) ?? {};
        const updatedContent = { ...existingContent, heroVideoUrl };

        const { error } = await supabase
            .from('website_content')
            .upsert(
                {
                    page: 'home',
                    section: 'hero',
                    content: updatedContent,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'page,section', ignoreDuplicates: false }
            );

        if (error) {
            console.error('[hero-video] DB write error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
        }

        console.log('[hero-video] POST → saved heroVideoUrl:', heroVideoUrl);
        return NextResponse.json({ success: true, heroVideoUrl }, { headers: NO_STORE_HEADERS });
    } catch (err: any) {
        console.error('[hero-video] POST error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500, headers: NO_STORE_HEADERS });
    }
}
