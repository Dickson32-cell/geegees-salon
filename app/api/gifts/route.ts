import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all gift requests
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('gift_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[API] Gift requests fetch error:', error);
            throw new Error(error.message);
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('[API] Gift requests catch error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST create new gift request
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            senderName,
            senderEmail,
            senderPhone,
            recipientName,
            message,
        } = body;

        // Validation
        if (!senderName || !senderPhone || !recipientName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const giftData = {
            sender_name: senderName,
            sender_email: senderEmail || '',
            sender_phone: senderPhone,
            recipient_name: recipientName,
            message: message || '',
            status: 'pending'
        };

        const { data, error } = await supabase
            .from('gift_requests')
            .insert([giftData])
            .select()
            .single();

        if (error) {
            console.error('[API] Gift request creation error:', error);
            return NextResponse.json({
                error: 'Failed to create gift request',
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('[API] Gift request creation catch error:', error);
        return NextResponse.json({
            error: 'Failed to create gift request',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
