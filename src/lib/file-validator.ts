import * as XLSX from 'exceljs'

export interface ValidationResult {
    fileName: string
    rowCount: number
    columns: Array<{
        name: string
        required: boolean
        found: boolean
        type?: string
    }>
    previewRows: Record<string, any>[]
    errors: string[]
    warnings: string[]
    isValid: boolean
}

const COSEC_REQUIRED_COLUMNS = [
    'Employee ID',
    'Employee Name',
    'Date',
    'In Time',
    'Out Time',
    'Total Hours',
]

const COSEC_COLUMN_ALIASES: Record<string, string[]> = {
    'Employee ID': ['Employee Number'],
    'Employee Name': ['Name'],
    'Date': ['Attendance Date'],
    'In Time': ['Punch In', 'Check In'],
    'Out Time': ['Punch Out', 'Check Out'],
    'Total Hours': ['Hours', 'Duration'],
}

const BBHR_REQUIRED_COLUMNS = [
    'Employee ID',
    'Employee Name',
    'Leave Type',
    'From Date',
    'To Date',
    'Days',
]

const BBHR_COLUMN_ALIASES: Record<string, string[]> = {
    'Employee ID': ['Employee Number'],
    'Employee Name': ['Name'],
    'Leave Type': ['Category'],
    'From Date': ['From'],
    'To Date': ['To'],
    'Days': ['Amount'],
}

export class FileValidator {
    static async validateCosecFile(file: File): Promise<ValidationResult> {
        return this.validateExcelFile(file, COSEC_REQUIRED_COLUMNS, 'COSEC', COSEC_COLUMN_ALIASES)
    }

    static async validateBBHRFile(file: File): Promise<ValidationResult> {
        return this.validateExcelFile(file, BBHR_REQUIRED_COLUMNS, 'BBHR', BBHR_COLUMN_ALIASES)
    }

    private static async validateExcelFile(
        file: File,
        requiredColumns: string[],
        fileType: string,
        aliases?: Record<string, string[]>
    ): Promise<ValidationResult> {
        const errors: string[] = []
        const warnings: string[] = []
        const columns: ValidationResult['columns'] = []

        try {
            // Read file
            const buffer = await file.arrayBuffer()
            const workbook = new XLSX.Workbook()

            try {
                await workbook.xlsx.load(buffer)
            } catch (loadError: any) {
                // If XLSX load fails, try CSV parser as fallback
                console.warn('Failed to load as XLSX, attempting alternative parsing:', loadError.message)
                errors.push(`Failed to read Excel file: ${loadError.message}`)
                return {
                    fileName: file.name,
                    rowCount: 0,
                    columns: requiredColumns.map(name => ({ name, required: true, found: false })),
                    previewRows: [],
                    errors,
                    warnings,
                    isValid: false,
                }
            }

            // Get first worksheet
            const worksheet = workbook.worksheets[0]

            if (!worksheet) {
                errors.push('No worksheet found in the file. Please ensure the file contains at least one sheet with data.')
                return {
                    fileName: file.name,
                    rowCount: 0,
                    columns: requiredColumns.map(name => ({ name, required: true, found: false })),
                    previewRows: [],
                    errors,
                    warnings,
                    isValid: false,
                }
            }

            // Get headers (first row)
            const headerRow = worksheet.getRow(1)
            const headers: string[] = []
            const normalizedHeaders: Map<string, string> = new Map() // Maps normalized -> original

            headerRow.eachCell((cell, colNumber) => {
                const originalHeader = cell.text.trim()
                headers[colNumber - 1] = originalHeader
                normalizedHeaders.set(originalHeader.toLowerCase(), originalHeader)
            })

            // Filter out empty headers
            const filteredHeaders = headers.filter(h => h !== undefined && h !== '')

            if (filteredHeaders.length === 0) {
                errors.push('No column headers found in the first row. Please ensure the file has headers in the first row.')
                return {
                    fileName: file.name,
                    rowCount: 0,
                    columns: requiredColumns.map(name => ({ name, required: true, found: false })),
                    previewRows: [],
                    errors,
                    warnings,
                    isValid: false,
                }
            }

            // Validate required columns with aliases
            requiredColumns.forEach(requiredCol => {
                const allVariations = [requiredCol, ...(aliases?.[requiredCol] || [])]
                const found = filteredHeaders.some(h => {
                    const normalizedH = h.toLowerCase().trim()
                    return allVariations.some(v => v.toLowerCase().trim() === normalizedH)
                })

                columns.push({
                    name: requiredCol,
                    required: true,
                    found,
                })

                if (!found) {
                    const suggestions = aliases?.[requiredCol] || []
                    if (suggestions.length > 0) {
                        errors.push(
                            `Missing required column: "${requiredCol}"\n` +
                            `${suggestions.map(s => `--> ${requiredCol} === ${s}`).join('\n')}`
                        )
                    } else {
                        errors.push(`Missing required column: "${requiredCol}"`)
                    }
                }
            })

            // Add found columns that are not required
            filteredHeaders.forEach(header => {
                if (header && !requiredColumns.some(rc => {
                    const allVariations = [rc, ...(aliases?.[rc] || [])]
                    return allVariations.some(v => v.toLowerCase().trim() === header.toLowerCase().trim())
                })) {
                    columns.push({
                        name: header,
                        required: false,
                        found: true,
                    })
                }
            })

            // Get row count (excluding header)
            const rowCount = worksheet.rowCount - 1

            if (rowCount === 0) {
                warnings.push('File contains no data rows')
            } else if (rowCount < 10) {
                warnings.push(`File contains only ${rowCount} data rows`)
            }

            // Get preview rows (first 5 data rows)
            const previewRows: Record<string, any>[] = []
            const maxPreviewRows = Math.min(5, rowCount)

            for (let i = 2; i <= maxPreviewRows + 1; i++) {
                const row = worksheet.getRow(i)
                const rowData: Record<string, any> = {}

                filteredHeaders.forEach((header, index) => {
                    if (header) {
                        const cell = row.getCell(index + 1)
                        rowData[header] = cell.value?.toString() || ''
                    }
                })

                previewRows.push(rowData)
            }

            // Validate data types for required columns
            if (fileType === 'COSEC' && previewRows.length > 0) {
                // Check if dates are valid
                previewRows.forEach((row, idx) => {
                    const dateHeader = filteredHeaders.find(h =>
                        ['Date', 'Attendance Date'].some(d => d.toLowerCase() === h.toLowerCase())
                    )
                    if (dateHeader && row[dateHeader] && !this.isValidDate(row[dateHeader])) {
                        warnings.push(`Row ${idx + 2}: Invalid date format in Date column`)
                    }
                })
            }

            return {
                fileName: file.name,
                rowCount,
                columns,
                previewRows,
                errors,
                warnings,
                isValid: errors.length === 0,
            }
        } catch (error: any) {
            errors.push(`Failed to process file: ${error.message}`)
            return {
                fileName: file.name,
                rowCount: 0,
                columns: requiredColumns.map(name => ({ name, required: true, found: false })),
                previewRows: [],
                errors,
                warnings,
                isValid: false,
            }
        }
    }

    private static isValidDate(value: any): boolean {
        if (!value) return false
        const date = new Date(value)
        return !isNaN(date.getTime())
    }
}
