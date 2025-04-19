"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Upload, FileType, Clipboard, FileJson, ArrowDown, AlertCircle } from "lucide-react"
import { cn } from "../lib/utils"
import JsonEditor from "./json-editor"
import ResultDisplay from "./result-display"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"

interface AnalysisResult extends Record<string, unknown> {
  files: File[];
  jsonSpec: string;
}

export default function FileUploadUI() {
  const [files, setFiles] = useState<File[]>([])
  const [jsonSpec, setJsonSpec] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const jsonEditorRef = useRef<HTMLDivElement>(null)

  // Handle file selection via button
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)

      // If files are selected but no JSON spec yet, scroll to JSON editor
      if (jsonSpec.trim() === "") {
        setTimeout(() => {
          jsonEditorRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }
  }

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files)
        const validFiles = droppedFiles.filter(
          (file) => file.type === "application/pdf" || file.type.startsWith("image/"),
        )
        setFiles(validFiles)

        // If files are dropped but no JSON spec yet, scroll to JSON editor
        if (jsonSpec.trim() === "") {
          setTimeout(() => {
            jsonEditorRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }
      }
    },
    [jsonSpec],
  )

  // Handle paste event
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const pastedFiles = Array.from(e.clipboardData.files)
        const validFiles = pastedFiles.filter(
          (file) => file.type === "application/pdf" || file.type.startsWith("image/"),
        )
        if (validFiles.length > 0) {
          setFiles(validFiles)
          e.preventDefault()

          // If files are pasted but no JSON spec yet, scroll to JSON editor
          if (jsonSpec.trim() === "") {
            setTimeout(() => {
              jsonEditorRef.current?.scrollIntoView({ behavior: "smooth" })
            }, 100)
          }
        }
      }
    },
    [jsonSpec],
  )

  // Add and remove paste event listener
  useEffect(() => {
    document.addEventListener("paste", handlePaste)
    return () => {
      document.removeEventListener("paste", handlePaste)
    }
  }, [handlePaste])

  // Handle form submission
  const handleSubmit = async () => {
    if (files.length === 0 || !jsonSpec.trim() || isUploading) return

    setIsUploading(true)
    try {
      // Use our mock API function instead of a fetch call
      const data: AnalysisResult = {
        "files": files,
        "jsonSpec": jsonSpec
      }
      setResult(data)
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Failed to process your request. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Clear all inputs and results
  const handleClear = () => {
    setFiles([])
    setJsonSpec("")
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isFileUploaded = files.length > 0
  const isJsonProvided = jsonSpec.trim().length > 0
  const canSubmit = isFileUploaded && isJsonProvided

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3">
                Step 1
              </Badge>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Files
              </CardTitle>
            </div>
            <Badge
              variant={isFileUploaded ? "success" : "outline"}
              className={isFileUploaded ? "bg-green-100 text-green-800" : ""}
            >
              {isFileUploaded ? "Files Selected" : "Required"}
            </Badge>
          </div>
          <CardDescription>
            Upload PDF or image files that will be parsed according to your JSON specification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={dropAreaRef}
            className={cn(
              "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
              "hover:border-primary hover:bg-muted/50",
              files.length > 0 ? "border-primary bg-muted/50" : "border-muted-foreground/25",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="application/pdf,image/*"
              className="hidden"
              multiple
            />

            {files.length > 0 ? (
              <div className="space-y-2">
                <FileType className="h-10 w-10 text-primary mx-auto" />
                <p className="font-medium">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                </p>
                <ul className="text-sm text-muted-foreground">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center space-x-4">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <Clipboard className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Drag and drop, click to browse, or paste from clipboard</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <ArrowDown className="h-8 w-8 text-muted-foreground" />
      </div>

      <Card ref={jsonEditorRef}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Badge variant="outline" className="mr-3">
                Step 2
              </Badge>
              <CardTitle className="flex items-center">
                <FileJson className="h-5 w-5 mr-2" />
                JSON Specification
              </CardTitle>
            </div>
            <Badge
              variant={isJsonProvided ? "success" : "outline"}
              className={isJsonProvided ? "bg-green-100 text-green-800" : ""}
            >
              {isJsonProvided ? "JSON Provided" : "Required"}
            </Badge>
          </div>
          <CardDescription>Define how your uploaded files should be parsed with a JSON specification</CardDescription>
        </CardHeader>
        <CardContent>
          <JsonEditor value={jsonSpec} onChange={setJsonSpec} />
        </CardContent>
      </Card>

      {!canSubmit && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {!isFileUploaded && !isJsonProvided
              ? "Please upload files and provide a JSON specification to continue"
              : !isFileUploaded
                ? "Please upload at least one file to continue"
                : "Please provide a JSON specification to continue"}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={handleClear}>
          Clear All
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading || !canSubmit} className="min-w-[120px]">
          {isUploading ? "Processing..." : "Analyze Files"}
        </Button>
      </div>

      {result && (
        <div className="mt-4">
          <ResultDisplay result={result} />
        </div>
      )}
    </div>
  )
}

