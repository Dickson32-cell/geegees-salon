import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH update gift request status
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        const updateData: any = {};

        if (body.status !== undefined) {
            updateData.status = body.status;
        }

        const { data, error } = await supabase
            .from('gift_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[API] Gift request update error:', error);
            return NextResponse.json({
                error: 'Failed to update gift request',
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('[API] Gift request update catch error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// DELETE gift request
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        const { error } = await supabase
            .from('gift_requests')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[API] Gift request deletion error:', error);
            return NextResponse.json({
                error: 'Failed to delete gift request',
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Gift request deleted' });
    } catch (error) {
        console.error('[API] Gift request deletion catch error:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
