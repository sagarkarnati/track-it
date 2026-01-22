"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Report } from '@/types/database'

export function useReports() {
    const [reports, setReports] = useState<Report[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()

        async function fetchReports() {
            try {
                const { data, error: fetchError } = await supabase
                    .from('reports')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (fetchError) throw fetchError
                setReports(data || [])
                setIsLoading(false)
            } catch (err: any) {
                setError(err.message)
                setIsLoading(false)
            }
        }

        fetchReports()

        // Subscribe to changes
        const channel = supabase
            .channel('reports')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reports',
                },
                (payload) => {
                    console.log('Reports changed:', payload)

                    if (payload.eventType === 'INSERT' && payload.new) {
                        setReports((prev) => [payload.new as Report, ...prev])
                    } else if (payload.eventType === 'UPDATE' && payload.new) {
                        setReports((prev) =>
                            prev.map((r) => (r.id === payload.new.id ? (payload.new as Report) : r))
                        )
                    } else if (payload.eventType === 'DELETE' && payload.old) {
                        setReports((prev) => prev.filter((r) => r.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { reports, isLoading, error, refetch: () => setIsLoading(true) }
}
