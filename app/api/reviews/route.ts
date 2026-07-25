import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[API] Reviews fetch error:', error);
            throw new Error(error.message);
        }

        return NextResponse.json(data || []);
    } catch (error) {
        console.error('[API] Reviews catch error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { stylistName, clientName, rating, comment } = body;

        if (!stylistName || !clientName || !rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                stylist_name: stylistName,
                client_name: clientName,
                rating: parseInt(rating),
                comment: comment || null
            }])
            .select()
            .single();

        if (error) {
            console.error('[API] Review creation error:', error);
            return NextResponse.json({ error: 'Failed to create review', details: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('[API] Review creation catch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', parseInt(id));

        if (error) {
            console.error('[API] Review deletion error:', error);
            return NextResponse.json({ error: 'Failed to delete review', details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] Review deletion catch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
