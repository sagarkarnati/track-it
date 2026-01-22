import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/reports/[id]/download - Download the generated report
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // Get report details
        const { data: report, error: reportError } = await supabase
            .from('reports')
            .select('output_file_path, name')
            .eq('id', id)
            .single()

        if (reportError || !report?.output_file_path) {
            return NextResponse.json(
                { error: 'Report not found or not yet generated' },
                { status: 404 }
            )
        }

        // Get signed URL for download
        const { data, error } = await supabase.storage
            .from('reports')
            .createSignedUrl(report.output_file_path, 60) // 60 seconds expiry

        if (error) {
            console.error('Error creating signed URL:', error)
            return NextResponse.json(
                { error: 'Failed to generate download link' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            downloadUrl: data.signedUrl,
            fileName: report.name,
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
