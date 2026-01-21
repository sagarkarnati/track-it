"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FileDropzoneProps {
    onFileSelect: (file: File) => void
    onFileRemove: () => void
    selectedFile: File | null
    accept: Record<string, string[]>
    label: string
    description: string
}

export function FileDropzone({
    onFileSelect,
    onFileRemove,
    selectedFile,
    accept,
    label,
    description,
}: FileDropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0])
            }
        },
        [onFileSelect]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: false,
        maxSize: 10 * 1024 * 1024, // 10MB
    })

    if (selectedFile) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100">
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onFileRemove}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                        <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? "Drop file here"
                                : "Drag & drop file here, or click to browse"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
