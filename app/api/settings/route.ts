import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET settings
export async function GET() {
  try {
    // Try to get settings from website_content table
    const settings = await prisma.websiteContent.findFirst({
      where: { page: 'settings' }
    });

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
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST/UPDATE settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { whatsappNumber, whatsappBusinessApiKey, logoUrl } = body;

    // Upsert settings in website_content table
    const settings = await prisma.websiteContent.upsert({
      where: { page: 'settings' },
      update: {
        content: {
          whatsappNumber,
          whatsappBusinessApiKey,
          logoUrl
        }
      },
      create: {
        page: 'settings',
        section: 'system',
        content: {
          whatsappNumber,
          whatsappBusinessApiKey,
          logoUrl
        }
      }
    });

    return NextResponse.json({ success: true, settings: settings.content });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
