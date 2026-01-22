import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserId } from '@/lib/auth/mock-user'

// POST /api/reports/[id]/upload - Handle file uploads
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const formData = await request.formData()

        const cosecFile = formData.get('cosecFile') as File | null
        const bbhrFile = formData.get('bbhrFile') as File | null

        if (!cosecFile || !bbhrFile) {
            return NextResponse.json(
                { error: 'Both COSEC and BBHR files are required' },
                { status: 400 }
            )
        }

        const mockUserId = getCurrentUserId()

        // Upload COSEC file
        const cosecPath = `${mockUserId}/${id}/cosec_${cosecFile.name}`
        const { error: cosecError } = await supabase.storage
            .from('reports')
            .upload(cosecPath, cosecFile, {
                cacheControl: '3600',
                upsert: false,
            })

        if (cosecError) {
            console.error('Error uploading COSEC file:', cosecError)
            return NextResponse.json(
                { error: 'Failed to upload COSEC file' },
                { status: 500 }
            )
        }

        // Upload BBHR file
        const bbhrPath = `${mockUserId}/${id}/bbhr_${bbhrFile.name}`
        const { error: bbhrError } = await supabase.storage
            .from('reports')
            .upload(bbhrPath, bbhrFile, {
                cacheControl: '3600',
                upsert: false,
            })

        if (bbhrError) {
            console.error('Error uploading BBHR file:', bbhrError)
            // Clean up COSEC file
            await supabase.storage.from('reports').remove([cosecPath])
            return NextResponse.json(
                { error: 'Failed to upload BBHR file' },
                { status: 500 }
            )
        }

        // Update report with file paths
        const { data: report, error: updateError } = await supabase
            .from('reports')
            .update({
                cosec_file_path: cosecPath,
                bbhr_file_path: bbhrPath,
            })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Error updating report:', updateError)
            return NextResponse.json(
                { error: 'Failed to update report with file paths' },
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
