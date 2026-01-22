import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Rows3 } from "lucide-react"

export interface ColumnValidation {
    name: string
    required: boolean
    found: boolean
    type?: string
}

export interface FilePreviewData {
    fileName: string
    rowCount: number
    columns: ColumnValidation[]
    previewRows: Record<string, any>[]
    errors: string[]
    warnings: string[]
}

interface FilePreviewProps {
    data: FilePreviewData
    fileType: "COSEC" | "BBHR"
}

export function FilePreview({ data, fileType }: FilePreviewProps) {
    const hasErrors = data.errors.length > 0
    const hasWarnings = data.warnings.length > 0
    const allRequiredColumnsFound = data.columns.filter(c => c.required).every(c => c.found)
    const missingColumns = data.columns.filter(c => c.required && !c.found)

    return (
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">{fileType} File Preview</CardTitle>
                        </div>
                        <CardDescription className="text-sm">{data.fileName}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge variant={hasErrors ? "destructive" : allRequiredColumnsFound ? "default" : "secondary"} className="font-semibold">
                            {hasErrors ? "Invalid" : allRequiredColumnsFound ? "Valid" : "Warning"}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Rows3 className="h-3.5 w-3.5" />
                            <span>{data.rowCount.toLocaleString()} rows</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Validation Alerts */}
                {hasErrors && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                            <p className="font-semibold mb-1">File validation failed:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-sm">
                                {data.errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {hasWarnings && !hasErrors && (
                    <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-900 dark:text-amber-100">
                            <p className="font-semibold mb-1">Warnings:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-sm">
                                {data.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Column Validation */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Column Validation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.columns.map((column, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-3 rounded-lg border ${column.required && !column.found
                                        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                                        : column.found
                                            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20"
                                            : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/20"
                                    }`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    {column.found ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    )}
                                    <span className="text-sm font-medium truncate">{column.name}</span>
                                </div>
                                {column.required && (
                                    <Badge variant="outline" className="text-xs flex-shrink-0">Required</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Preview */}
                {data.previewRows.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Data Preview (First 5 Rows)</h4>
                        <ScrollArea className="w-full border rounded-lg">
                            <div className="min-w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            {Object.keys(data.previewRows[0]).map((header) => (
                                                <TableHead key={header} className="font-semibold whitespace-nowrap">
                                                    {header}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.previewRows.map((row, i) => (
                                            <TableRow key={i}>
                                                {Object.values(row).map((cell, j) => (
                                                    <TableCell key={j} className="whitespace-nowrap">
                                                        {cell?.toString() || "-"}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {/* Summary Stats */}
                {missingColumns.length === 0 && !hasErrors && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                            All validations passed. File is ready for processing.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
