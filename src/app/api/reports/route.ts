import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth/mock-user'

// GET /api/reports - List all reports for the user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const mockUserId = getCurrentUserId()

        const { data: reports, error } = await supabase
            .from('reports')
            .select('*')
            .eq('profile_id', mockUserId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching reports:', error)
            return NextResponse.json(
                { error: 'Failed to fetch reports' },
                { status: 500 }
            )
        }

        return NextResponse.json({ reports })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.month) {
            return NextResponse.json(
                { error: 'Name and month are required' },
                { status: 400 }
            )
        }

        const mockUserId = getCurrentUserId()

        const { data: report, error } = await supabase
            .from('reports')
            .insert({
                profile_id: mockUserId,
                name: body.name,
                month: body.month,
                status: 'processing',
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating report:', error)
            return NextResponse.json(
                { error: 'Failed to create report' },
                { status: 500 }
            )
        }

        return NextResponse.json({ report }, { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
