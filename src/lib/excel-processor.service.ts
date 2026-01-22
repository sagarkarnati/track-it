import * as ExcelJS from 'exceljs';
import { createAdminClient } from '@/lib/supabase/admin';

interface CosecRecord {
    date: Date;
    userId: string;
    name: string;
    firstIn?: string;
    lastOut?: string;
    lateOut?: string;
}

interface BBHRLeave {
    employeeNumber: string;
    name: string;
    from: Date;
    to: Date;
    category: string; // "Earned Leave", "Sick Leave", "Casual Leave", "Work from Home"
    amount: number;
    status: string; // "Approved", "Requested"
}

interface EmployeeAttendance {
    empNo: string;
    name: string;
    dates: Map<string, AttendanceStatus>; // date string -> status
    totalPresent: number;
    totalAbsent: number;
    totalWFH: number;
    totalLeave: number;
    clBalance: number;
    elBalance: number;
    slBalance: number;
}

type AttendanceStatus = 'P' | 'WFH' | 'EL' | 'SL' | 'CL' | 'A' | '-' | 'H';

interface Holiday {
    date: Date;
    description: string;
}

export class ExcelProcessorService {
    private supabase = createAdminClient();
    private holidays: Holiday[] = [];

    constructor() {
        this.initializeHolidays();
    }

    /**
     * Initialize India holidays for 2026
     */
    private initializeHolidays() {
        const holidayDates = [
            { date: '2026-01-01', description: "New Year's Day" },
            { date: '2026-01-15', description: 'Pongal' },
            { date: '2026-01-26', description: 'Republic Day' },
            { date: '2026-04-14', description: 'Tamil New Year' },
            { date: '2026-05-01', description: 'May Day' },
            { date: '2026-05-28', description: 'Bakrid' },
            { date: '2026-09-14', description: 'Ganesh Chaturthi' },
            { date: '2026-10-02', description: 'Gandhi Jayanti' },
            { date: '2026-10-19', description: 'Ayudha Pooja' },
            { date: '2026-12-25', description: 'Christmas' },
        ];

        this.holidays = holidayDates.map(h => ({
            date: new Date(h.date),
            description: h.description
        }));
    }

    /**
     * Main processing function
     */
    async processAttendanceReport(
        cosecFilePath: string,
        bbhrFilePath: string,
        reportId: string
    ): Promise<string> {
        try {
            await this.logProgress(reportId, 'Starting attendance processing...');

            // Parse COSEC file
            await this.logProgress(reportId, 'Reading COSEC attendance file...');
            const cosecRecords = await this.parseCosecFile(cosecFilePath);

            // Parse BBHR file
            await this.logProgress(reportId, 'Reading BBHR time-off schedule...');
            const bbhrLeaves = await this.parseBBHRFile(bbhrFilePath);

            // Process attendance
            await this.logProgress(reportId, 'Processing attendance data...');
            const attendance = await this.processAttendance(cosecRecords, bbhrLeaves);

            // Generate report
            await this.logProgress(reportId, 'Generating Excel report...');
            const outputPath = await this.generateReport(attendance, reportId);

            await this.logProgress(reportId, 'Report generated successfully!');
            return outputPath;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await this.logError(reportId, `Processing failed: ${errorMessage}`);
            throw error;
        }
    }

    /**
     * Parse COSEC dump file
     */
    private async parseCosecFile(filePath: string): Promise<CosecRecord[]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        if (!worksheet) {
            throw new Error('COSEC file is empty or invalid');
        }

        const records: CosecRecord[] = [];
        let currentDate: Date | null = null;

        worksheet.eachRow((row, rowNumber) => {
            // Skip header rows
            if (rowNumber < 4) return;

            const firstCell = row.getCell(1).value?.toString() || '';

            // Check if this row contains a date header
            const dateMatch = firstCell.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (dateMatch) {
                const [, day, month, year] = dateMatch;
                currentDate = new Date(`${year}-${month}-${day}`);
                return;
            }

            // Process attendance record if we have a current date
            if (currentDate && firstCell.match(/^\d{6}$/)) {
                const userId = row.getCell(1).value?.toString() || '';
                const name = row.getCell(3).value?.toString() || '';
                const firstIn = row.getCell(4).value?.toString() || '';
                const lastOut = row.getCell(5).value?.toString() || '';
                const lateOut = row.getCell(8).value?.toString() || '';

                records.push({
                    date: new Date(currentDate),
                    userId,
                    name,
                    firstIn: firstIn || undefined,
                    lastOut: lastOut || undefined,
                    lateOut: lateOut || undefined,
                });
            }
        });

        return records;
    }

    /**
     * Parse BBHR time-off schedule file
     */
    private async parseBBHRFile(filePath: string): Promise<BBHRLeave[]> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        if (!worksheet) {
            throw new Error('BBHR file is empty or invalid');
        }

        const leaves: BBHRLeave[] = [];

        worksheet.eachRow((row, rowNumber) => {
            // Skip header row
            if (rowNumber < 2) return;

            const empNo = row.getCell(1).value?.toString() || '';
            const name = row.getCell(2).value?.toString() || '';
            const fromValue = row.getCell(3).value;
            const toValue = row.getCell(4).value;
            const category = row.getCell(5).value?.toString() || '';
            const amount = Number(row.getCell(6).value) || 0;
            const status = row.getCell(8).value?.toString() || '';

            if (!empNo || !fromValue || !toValue) return;

            const from = this.parseExcelDate(fromValue);
            const to = this.parseExcelDate(toValue);

            leaves.push({
                employeeNumber: empNo,
                name,
                from,
                to,
                category,
                amount,
                status,
            });
        });

        return leaves;
    }

    /**
     * Parse Excel date (handles both Date objects and MM/DD/YY strings)
     */
    private parseExcelDate(value: any): Date {
        if (value instanceof Date) {
            return value;
        }

        if (typeof value === 'string') {
            // Handle MM/DD/YY format
            const parts = value.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0], 10);
                const day = parseInt(parts[1], 10);
                let year = parseInt(parts[2], 10);

                // Convert 2-digit year to 4-digit
                if (year < 100) {
                    year += year < 50 ? 2000 : 1900;
                }

                return new Date(year, month - 1, day);
            }
        }

        // If it's a number, assume it's an Excel serial date
        // Excel serial date: days since 1900-01-01
        if (typeof value === 'number') {
            const EXCEL_EPOCH = new Date(1899, 11, 30); // Excel's epoch
            const days = Math.floor(value);
            const milliseconds = days * 24 * 60 * 60 * 1000;
            return new Date(EXCEL_EPOCH.getTime() + milliseconds);
        }

        throw new Error(`Unable to parse date: ${value}`);
    }

    /**
     * Process attendance combining COSEC and BBHR data
     */
    private async processAttendance(
        cosecRecords: CosecRecord[],
        bbhrLeaves: BBHRLeave[]
    ): Promise<Map<string, EmployeeAttendance>> {
        const attendanceMap = new Map<string, EmployeeAttendance>();

        // Get date range from COSEC records
        const dates = cosecRecords.map(r => r.date.getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        // Initialize employee attendance data
        const allEmployees = new Set<string>();
        cosecRecords.forEach(r => allEmployees.add(r.userId));
        bbhrLeaves.forEach(l => allEmployees.add(l.employeeNumber));

        allEmployees.forEach(empNo => {
            const name = cosecRecords.find(r => r.userId === empNo)?.name ||
                bbhrLeaves.find(l => l.employeeNumber === empNo)?.name ||
                'Unknown';

            attendanceMap.set(empNo, {
                empNo,
                name,
                dates: new Map(),
                totalPresent: 0,
                totalAbsent: 0,
                totalWFH: 0,
                totalLeave: 0,
                clBalance: 10, // Default balances
                elBalance: 15,
                slBalance: 12,
            });
        });

        // Process each date in the range
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
            const dateStr = this.formatDate(d);
            const dayOfWeek = d.getDay();

            // Check if it's a weekend
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Check if it's a holiday
            const isHoliday = this.holidays.some(h =>
                this.formatDate(h.date) === dateStr
            );

            attendanceMap.forEach((employee, empNo) => {
                if (isWeekend) {
                    employee.dates.set(dateStr, '-');
                    return;
                }

                if (isHoliday) {
                    employee.dates.set(dateStr, 'H');
                    return;
                }

                // Check for leave in BBHR
                const leave = this.getLeaveForDate(empNo, d, bbhrLeaves);
                if (leave) {
                    const status = this.getLeaveStatus(leave.category);
                    employee.dates.set(dateStr, status);

                    if (status === 'WFH') {
                        employee.totalWFH++;
                    } else {
                        employee.totalLeave++;
                        // Deduct from balance
                        if (status === 'CL') employee.clBalance--;
                        else if (status === 'EL') employee.elBalance--;
                        else if (status === 'SL') employee.slBalance--;
                    }
                    return;
                }

                // Check COSEC attendance
                const attendance = cosecRecords.find(r =>
                    r.userId === empNo && this.formatDate(r.date) === dateStr
                );

                if (attendance && (attendance.firstIn || attendance.lastOut)) {
                    employee.dates.set(dateStr, 'P');
                    employee.totalPresent++;
                } else {
                    employee.dates.set(dateStr, 'A');
                    employee.totalAbsent++;
                }
            });
        }

        return attendanceMap;
    }

    /**
     * Get leave for a specific employee and date
     */
    private getLeaveForDate(empNo: string, date: Date, leaves: BBHRLeave[]): BBHRLeave | null {
        return leaves.find(leave =>
            leave.employeeNumber === empNo &&
            leave.status === 'Approved' &&
            date >= leave.from &&
            date <= leave.to
        ) || null;
    }

    /**
     * Map leave category to status code
     */
    private getLeaveStatus(category: string): AttendanceStatus {
        if (category.includes('Work from Home')) return 'WFH';
        if (category.includes('Earned Leave')) return 'EL';
        if (category.includes('Sick Leave')) return 'SL';
        if (category.includes('Casual Leave')) return 'CL';
        return 'A';
    }

    /**
     * Generate the output Excel report
     */
    private async generateReport(
        attendance: Map<string, EmployeeAttendance>,
        reportId: string
    ): Promise<string> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Get all unique dates
        const allDates = new Set<string>();
        attendance.forEach(emp => {
            emp.dates.forEach((_, date) => allDates.add(date));
        });
        const sortedDates = Array.from(allDates).sort();

        // Define columns
        const columns: Partial<ExcelJS.Column>[] = [
            { header: 'EMP NO', key: 'empNo', width: 12 },
            { header: 'ASSOCIATE NAME', key: 'name', width: 25 },
            { header: 'CL - Balance', key: 'clBalance', width: 12 },
            { header: 'EL - Balance', key: 'elBalance', width: 12 },
            { header: 'SL - Balance', key: 'slBalance', width: 12 },
            { header: 'No. of days present', key: 'totalPresent', width: 18 },
            { header: 'No. of days absent', key: 'totalAbsent', width: 18 },
            { header: 'WFH', key: 'totalWFH', width: 10 },
        ];

        // Add date columns
        sortedDates.forEach(dateStr => {
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: '2-digit'
            });

            columns.push({
                header: `${dayName}, ${date.getDate()}/${date.toLocaleDateString('en-US', { month: 'short' })}/${date.getFullYear().toString().slice(-2)}`,
                key: dateStr,
                width: 12,
            });
        });

        worksheet.columns = columns;

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, size: 11 };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' },
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data rows
        attendance.forEach((employee) => {
            const rowData: any = {
                empNo: employee.empNo,
                name: employee.name,
                clBalance: employee.clBalance,
                elBalance: employee.elBalance,
                slBalance: employee.slBalance,
                totalPresent: employee.totalPresent,
                totalAbsent: employee.totalAbsent,
                totalWFH: employee.totalWFH,
            };

            sortedDates.forEach(dateStr => {
                rowData[dateStr] = employee.dates.get(dateStr) || '-';
            });

            const row = worksheet.addRow(rowData);

            // Apply cell coloring based on status
            sortedDates.forEach((dateStr, index) => {
                const cell = row.getCell(9 + index); // Date columns start at column 9
                const status = employee.dates.get(dateStr);

                if (status === 'P') {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD4EDDA' }, // Light green
                    };
                } else if (status === 'A') {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF8D7DA' }, // Light red
                    };
                } else if (status === 'WFH') {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD1ECF1' }, // Light blue
                    };
                } else if (['EL', 'SL', 'CL'].includes(status || '')) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFF3CD' }, // Light yellow
                    };
                } else if (status === 'H') {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFE2E3E5' }, // Light gray
                    };
                }

                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        // Save to temp file
        const timestamp = Date.now();
        const fileName = `attendance_report_${reportId}_${timestamp}.xlsx`;
        const outputPath = `/tmp/${fileName}`;

        await workbook.xlsx.writeFile(outputPath);

        return outputPath;
    }

    /**
     * Format date as YYYY-MM-DD
     */
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Log progress to database
     */
    private async logProgress(reportId: string, message: string) {
        try {
            await this.supabase.from('processing_logs').insert({
                report_id: reportId,
                message,
                status: 'info',
            });
        } catch (error) {
            console.error('Failed to log progress:', error);
        }
    }

    /**
     * Log error to database
     */
    private async logError(reportId: string, message: string) {
        try {
            await this.supabase.from('processing_logs').insert({
                report_id: reportId,
                message,
                status: 'error',
            });
        } catch (error) {
            console.error('Failed to log error:', error);
        }
    }
}
