import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/reports/[id] - Get a specific report
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: report, error } = await supabase
            .from('reports')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching report:', error)
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ report })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH /api/reports/[id] - Update a report
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const body = await request.json()

        const { data: report, error } = await supabase
            .from('reports')
            .update(body)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating report:', error)
            return NextResponse.json(
                { error: 'Failed to update report' },
                { status: 500 }
            )
        }

        return NextResponse.json({ report })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/reports/[id] - Delete a report
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting report:', error)
            return NextResponse.json(
                { error: 'Failed to delete report' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
