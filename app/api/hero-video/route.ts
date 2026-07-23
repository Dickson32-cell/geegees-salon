import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = {
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

async function getCurrentRecord() {
    const supabase = getSupabase();
    const { data } = await supabase
        .from('website_content')
        .select('content')
        .eq('page', 'home')
        .eq('section', 'hero')
        .maybeSingle();
    return { supabase, content: (data?.content as any) ?? {} };
}

async function saveContent(supabase: ReturnType<typeof getSupabase>, content: any) {
    return supabase
        .from('website_content')
        .upsert(
            { page: 'home', section: 'hero', content, updated_at: new Date().toISOString() },
            { onConflict: 'page,section', ignoreDuplicates: false }
        );
}

// GET — return the list of hero video URLs
export async function GET() {
    try {
        const { content } = await getCurrentRecord();
        const heroVideos: string[] = Array.isArray(content.heroVideos) ? content.heroVideos : [];
        // Legacy: if only a single heroVideoUrl exists, wrap it
        if (heroVideos.length === 0 && content.heroVideoUrl) {
            heroVideos.push(content.heroVideoUrl);
        }
        return NextResponse.json({ heroVideos }, { headers: NO_STORE });
    } catch (err: any) {
        return NextResponse.json({ heroVideos: [] }, { headers: NO_STORE });
    }
}

// POST — add a new video URL to the list
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { heroVideoUrl } = body;
        if (!heroVideoUrl || typeof heroVideoUrl !== 'string') {
            return NextResponse.json({ error: 'heroVideoUrl is required' }, { status: 400, headers: NO_STORE });
        }

        const { supabase, content } = await getCurrentRecord();
        const existing: string[] = Array.isArray(content.heroVideos) ? content.heroVideos : [];
        // Legacy migration
        if (existing.length === 0 && content.heroVideoUrl) existing.push(content.heroVideoUrl);
        // Avoid duplicates
        if (!existing.includes(heroVideoUrl)) {
            existing.push(heroVideoUrl);
        }
        const updated = { ...content, heroVideos: existing, heroVideoUrl: existing[0] };
        const { error } = await saveContent(supabase, updated);
        if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE });

        return NextResponse.json({ success: true, heroVideos: existing }, { headers: NO_STORE });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: NO_STORE });
    }
}

// DELETE — remove a video URL from the list
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { heroVideoUrl } = body;
        if (!heroVideoUrl) {
            return NextResponse.json({ error: 'heroVideoUrl is required' }, { status: 400, headers: NO_STORE });
        }

        const { supabase, content } = await getCurrentRecord();
        const existing: string[] = Array.isArray(content.heroVideos) ? content.heroVideos : [];
        const filtered = existing.filter((u) => u !== heroVideoUrl);
        const updated = { ...content, heroVideos: filtered, heroVideoUrl: filtered[0] ?? null };
        const { error } = await saveContent(supabase, updated);
        if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE });

        return NextResponse.json({ success: true, heroVideos: filtered }, { headers: NO_STORE });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: NO_STORE });
    }
}
