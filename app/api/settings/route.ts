import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET settings
export async function GET() {
  try {
    console.log('[API] Fetching settings...');

    // Try to get settings from website_content table
    const { data: settings, error } = await supabase
      .from('website_content')
      .select('*')
      .eq('page', 'settings')
      .eq('section', 'system')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[API] Settings fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch settings', details: error.message }, { status: 500 });
    }

    if (settings && settings.content) {
      return NextResponse.json(settings.content);
    }

    // Return empty settings if not found
    return NextResponse.json({
      whatsappNumber: '',
      whatsappBusinessApiKey: '',
      logoUrl: ''
    });
  } catch (error) {
    console.error('[API] Settings catch error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST/UPDATE settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { whatsappNumber, whatsappBusinessApiKey, logoUrl } = body;

    console.log('[API] Saving settings...');

    // Check if settings exist
    const { data: existing } = await supabase
      .from('website_content')
      .select('id')
      .eq('page', 'settings')
      .eq('section', 'system')
      .single();

    let result;
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('website_content')
        .update({
          content: {
            whatsappNumber,
            whatsappBusinessApiKey,
            logoUrl
          }
        })
        .eq('page', 'settings')
        .eq('section', 'system')
        .select()
        .single();

      if (error) {
        console.error('[API] Settings update error:', error);
        return NextResponse.json({
          error: 'Failed to update settings',
          details: error.message,
          code: error.code
        }, { status: 500 });
      }
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('website_content')
        .insert([{
          page: 'settings',
          section: 'system',
          content: {
            whatsappNumber,
            whatsappBusinessApiKey,
            logoUrl
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('[API] Settings creation error:', error);
        return NextResponse.json({
          error: 'Failed to create settings',
          details: error.message,
          code: error.code
        }, { status: 500 });
      }
      result = data;
    }

    return NextResponse.json({ success: true, settings: result.content });
  } catch (error: any) {
    console.error('[API] Settings save catch error:', error);
    return NextResponse.json({
      error: 'Failed to save settings',
      details: error.message || String(error),
      code: error.code
    }, { status: 500 });
  }
}
