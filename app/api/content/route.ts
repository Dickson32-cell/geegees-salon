import { NextResponse } from 'next/server';

// Default content structure
let websiteContent = {
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
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  if (page && websiteContent[page as keyof typeof websiteContent]) {
    return NextResponse.json(websiteContent[page as keyof typeof websiteContent]);
  }

  return NextResponse.json(websiteContent);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { page, section, data } = body;

  if (websiteContent[page as keyof typeof websiteContent] && section) {
    (websiteContent[page as keyof typeof websiteContent] as any)[section] = {
      ...(websiteContent[page as keyof typeof websiteContent] as any)[section],
      ...data,
    };
    return NextResponse.json({ success: true, data: (websiteContent[page as keyof typeof websiteContent] as any)[section] });
  }

  return NextResponse.json({ error: 'Invalid page or section' }, { status: 400 });
}
