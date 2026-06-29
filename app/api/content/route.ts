import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Default content structure (used as fallback if database is empty)
const defaultContent = {
  home: {
    hero: {
      id: 'home-hero',
      type: 'hero',
      title: 'Mastering the Art of Opulence & Grace',
      subtitle: 'The Editorial Experience',
      description: 'Experience luxury and style at GeeGees Unisex Salon',
      buttonText: 'Explore Services',
      buttonLink: '/services',
    },
    about: {
      id: 'home-about',
      type: 'about',
      title: 'Redefining Luxury Grooming',
      description: 'GeeGees Unisex Salon is more than a destination; it\'s a sanctuary for the discerning. We blend time-honored techniques with contemporary editorial trends to deliver an experience that transcends the traditional salon visit.',
      stat1Value: '15+',
      stat1Label: 'Years of Mastery',
      stat2Value: '24k',
      stat2Label: 'Clients Styled',
      buttonText: 'Our Story',
      buttonLink: '/team',
    },
    cta: {
      id: 'home-cta',
      type: 'cta',
      title: 'Secure Your Moment',
      description: 'Experience the pinnacle of editorial grooming. Our schedule fills quickly—reserve your appointment today.',
      buttonText: 'Book Your Appointment',
      buttonLink: '/booking',
    },
  },
  services: {
    hero: {
      id: 'services-hero',
      type: 'hero',
      title: 'Menu of Excellence',
      subtitle: 'The Art of Refinement',
      description: 'Explore our curated selection of bespoke grooming and beauty experiences, where precision meets artistry in every detail.',
    },
  },
  gallery: {
    hero: {
      id: 'gallery-hero',
      type: 'hero',
      title: 'The Editorial Gallery',
      subtitle: 'Visual Journey',
      description: 'Explore our curated collection of high-fashion transformations, meticulous styling, and the art of luxury grooming at GeeGees.',
    },
  },
  booking: {
    hero: {
      id: 'booking-hero',
      type: 'hero',
      title: 'Reserve Your Experience',
      description: 'Step into a world of curated beauty. Select your desired treatments and let our editorial experts transform your vision into reality.',
    },
  },
  footer: {
    contact: {
      id: 'footer-contact',
      type: 'contact',
      address: '123 Editorial Way,\nFashion District, NY',
      phone: '+1 (555) 987-6543',
      email: 'concierge@geegees.com',
    },
    social: {
      id: 'footer-social',
      type: 'social',
      instagramUrl: '#',
      facebookUrl: '#',
      youtubeUrl: '#',
      tiktokUrl: '#',
    },
  },
};

// Cache for 5 minutes (revalidate every 300 seconds)
export const revalidate = 300;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    console.log('[API] Fetching website content...');

    // Fetch all content from database
    const { data: dbContent, error } = await supabase
      .from('website_content')
      .select('*');

    if (error) {
      console.error('[API] Content fetch error:', error);
      // Return defaults if database fails
      if (page && defaultContent[page as keyof typeof defaultContent]) {
        return NextResponse.json(defaultContent[page as keyof typeof defaultContent]);
      }
      return NextResponse.json(defaultContent);
    }

    // Build content object from database, using defaults as fallback
    const websiteContent: any = { ...defaultContent };

    // Merge database content with defaults
    dbContent?.forEach((item) => {
      if (!websiteContent[item.page]) {
        websiteContent[item.page] = {};
      }
      websiteContent[item.page][item.section] = {
        ...websiteContent[item.page][item.section],
        ...(item.content as any)
      };
    });

    if (page && websiteContent[page]) {
      return NextResponse.json(websiteContent[page]);
    }

    return NextResponse.json(websiteContent);
  } catch (error) {
    console.error('[API] Content catch error:', error);
    // Return defaults if database fails
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (page && defaultContent[page as keyof typeof defaultContent]) {
      return NextResponse.json(defaultContent[page as keyof typeof defaultContent]);
    }
    return NextResponse.json(defaultContent);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, section, data } = body;

    if (!page || !section || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('[API] Saving content for page:', page, 'section:', section);

    // Check if content exists
    const { data: existing } = await supabase
      .from('website_content')
      .select('id')
      .eq('page', page)
      .eq('section', section)
      .single();

    let result;
    if (existing) {
      // Update existing content
      const { data: updated, error } = await supabase
        .from('website_content')
        .update({ content: data })
        .eq('page', page)
        .eq('section', section)
        .select()
        .single();

      if (error) {
        console.error('[API] Content update error:', error);
        return NextResponse.json({
          error: 'Failed to update content',
          details: error.message,
          code: error.code
        }, { status: 500 });
      }
      result = updated;
    } else {
      // Create new content
      const { data: created, error } = await supabase
        .from('website_content')
        .insert([{ page, section, content: data }])
        .select()
        .single();

      if (error) {
        console.error('[API] Content creation error:', error);
        return NextResponse.json({
          error: 'Failed to create content',
          details: error.message,
          code: error.code
        }, { status: 500 });
      }
      result = created;
    }

    return NextResponse.json({ success: true, data: result.content });
  } catch (error: any) {
    console.error('[API] Content save catch error:', error);
    // Return detailed error for debugging
    return NextResponse.json({
      error: 'Failed to save content',
      details: error.message || String(error),
      code: error.code
    }, { status: 500 });
  }
}
