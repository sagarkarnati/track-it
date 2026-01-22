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

const BBHR_REQUIRED_COLUMNS = [
  'Employee ID',
  'Employee Name',
  'Leave Type',
  'From Date',
  'To Date',
  'Days',
]

export class FileValidator {
  static async validateCosecFile(file: File): Promise<ValidationResult> {
    return this.validateExcelFile(file, COSEC_REQUIRED_COLUMNS, 'COSEC')
  }

  static async validateBBHRFile(file: File): Promise<ValidationResult> {
    return this.validateExcelFile(file, BBHR_REQUIRED_COLUMNS, 'BBHR')
  }

  private static async validateExcelFile(
    file: File,
    requiredColumns: string[],
    fileType: string
  ): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const columns: ValidationResult['columns'] = []

    try {
      // Read file
      const buffer = await file.arrayBuffer()
      const workbook = new XLSX.Workbook()
      await workbook.xlsx.load(buffer)

      // Get first worksheet
      const worksheet = workbook.worksheets[0]
      
      if (!worksheet) {
        errors.push('No worksheet found in the file')
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
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.text.trim()
      })

      // Validate required columns
      requiredColumns.forEach(requiredCol => {
        const found = headers.some(h => 
          h.toLowerCase().trim() === requiredCol.toLowerCase().trim()
        )
        columns.push({
          name: requiredCol,
          required: true,
          found,
        })
        
        if (!found) {
          errors.push(`Missing required column: "${requiredCol}"`)
        }
      })

      // Add found columns that are not required
      headers.forEach(header => {
        if (header && !requiredColumns.some(rc => 
          rc.toLowerCase().trim() === header.toLowerCase().trim()
        )) {
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
        
        headers.forEach((header, index) => {
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
          if (row['Date'] && !this.isValidDate(row['Date'])) {
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
      errors.push(`Failed to read file: ${error.message}`)
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
