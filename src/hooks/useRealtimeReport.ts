"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Report, ProcessingLog } from '@/types/database'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeReport(reportId: string | null) {
    const [report, setReport] = useState<Report | null>(null)
    const [logs, setLogs] = useState<ProcessingLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!reportId) {
            setIsLoading(false)
            return
        }

        const supabase = createClient()
        let reportChannel: RealtimeChannel
        let logsChannel: RealtimeChannel

        async function initialize() {
            try {
                // Fetch initial report data
                const { data: reportData, error: reportError } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('id', reportId)
                    .single()

                if (reportError) throw reportError
                setReport(reportData)

                // Fetch initial logs
                const { data: logsData, error: logsError } = await supabase
                    .from('processing_logs')
                    .select('*')
                    .eq('report_id', reportId)
                    .order('created_at', { ascending: true })

                if (logsError) throw logsError
                setLogs(logsData || [])

                // Subscribe to report changes
                reportChannel = supabase
                    .channel(`report:${reportId}`)
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'reports',
                            filter: `id=eq.${reportId}`,
                        },
                        (payload) => {
                            console.log('Report updated:', payload)
                            if (payload.new) {
                                setReport(payload.new as Report)
                            }
                        }
                    )
                    .subscribe()

                // Subscribe to logs changes
                logsChannel = supabase
                    .channel(`logs:${reportId}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'processing_logs',
                            filter: `report_id=eq.${reportId}`,
                        },
                        (payload) => {
                            console.log('New log:', payload)
                            if (payload.new) {
                                setLogs((prev) => [...prev, payload.new as ProcessingLog])
                            }
                        }
                    )
                    .subscribe()

                setIsLoading(false)
            } catch (err: any) {
                setError(err.message)
                setIsLoading(false)
            }
        }

        initialize()

        // Cleanup
        return () => {
            if (reportChannel) supabase.removeChannel(reportChannel)
            if (logsChannel) supabase.removeChannel(logsChannel)
        }
    }, [reportId])

    return { report, logs, isLoading, error }
}
