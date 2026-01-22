import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ExcelProcessorService } from '@/lib/excel-processor.service'
import { promises as fs } from 'fs'
import path from 'path'
import { tmpdir } from 'os'

// POST /api/reports/[id]/process - Process the uploaded files and generate report
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = createAdminClient()

        // Get report details
        const { data: report, error: reportError } = await supabase
            .from('reports')
            .select('*')
            .eq('id', id)
            .single()

        if (reportError || !report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            )
        }

        // Check if files are uploaded
        if (!report.cosec_file_path || !report.bbhr_file_path) {
            return NextResponse.json(
                { error: 'Files not uploaded yet' },
                { status: 400 }
            )
        }

        // Update status to processing
        await supabase
            .from('reports')
            .update({ status: 'processing' })
            .eq('id', id)

        // Log: Starting processing
        await supabase.from('processing_logs').insert({
            report_id: id,
            status: 'info',
            message: 'Starting report processing',
        })

        try {
            // Download files from storage
            await supabase.from('processing_logs').insert({
                report_id: id,
                status: 'info',
                message: 'Downloading input files',
            })

            const { data: cosecData } = await supabase.storage
                .from('reports')
                .download(report.cosec_file_path)

            const { data: bbhrData } = await supabase.storage
                .from('reports')
                .download(report.bbhr_file_path)

            if (!cosecData || !bbhrData) {
                throw new Error('Failed to download input files')
            }

            // Log: Files downloaded
            await supabase.from('processing_logs').insert({
                report_id: id,
                status: 'info',
                message: 'Input files downloaded successfully',
            })

            // Save files temporarily to disk
            const tempDir = tmpdir()
            const cosecPath = path.join(tempDir, `cosec_${id}.xlsx`)
            const bbhrPath = path.join(tempDir, `bbhr_${id}.xlsx`)

            await fs.writeFile(cosecPath, Buffer.from(await cosecData.arrayBuffer()))
            await fs.writeFile(bbhrPath, Buffer.from(await bbhrData.arrayBuffer()))

            await supabase.from('processing_logs').insert({
                report_id: id,
                status: 'info',
                message: 'Files prepared for processing',
            })

            // Process attendance using the Excel processor service
            const processor = new ExcelProcessorService()
            const outputFilePath = await processor.processAttendanceReport(
                cosecPath,
                bbhrPath,
                id
            )

            // Read the generated file
            const outputBuffer = await fs.readFile(outputFilePath)

            // Clean up temporary files
            await fs.unlink(cosecPath).catch(() => { })
            await fs.unlink(bbhrPath).catch(() => { })
            await fs.unlink(outputFilePath).catch(() => { })

            // Upload to storage
            await supabase.from('processing_logs').insert({
                report_id: id,
                status: 'info',
                message: 'Uploading generated report',
            })

            const outputPath = `${report.profile_id}/${id}/output_${report.name.replace(/\s+/g, '_')}.xlsx`
            const { error: uploadError } = await supabase.storage
                .from('reports')
                .upload(outputPath, outputBuffer, {
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    upsert: true,
                })

            if (uploadError) {
                throw new Error(`Failed to upload output file: ${uploadError.message}`)
            }

            // Update report status to completed
            await supabase
                .from('reports')
                .update({
                    status: 'completed',
                    output_file_path: outputPath,
                })
                .eq('id', id)

            // Log: Completed
            await supabase.from('processing_logs').insert({
                report_id: id,
                status: 'success',
                message: 'Report processing completed successfully',
            })

            return NextResponse.json({
                success: true,
                message: 'Report processed successfully',
            })
        } catch (processingError: any) {
            // Update status to failed
            await supabase
                .from('reports')
                .update({
                    status: 'failed',
                    error_message: processingError.message,
                })
                .eq('id', id)

            // Log: Error
            await supabase.from('processing_logs').insert({
                report_id: id,
                status: 'error',
                message: `Processing failed: ${processingError.message}`,
            })

            throw processingError
        }
    } catch (error: any) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
