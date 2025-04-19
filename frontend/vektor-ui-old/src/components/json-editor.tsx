"use client"

import { useState, useEffect } from "react"
import { Textarea } from "./ui/textarea"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle } from "lucide-react"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function JsonEditor({ value, onChange }: JsonEditorProps) {
  const [error, setError] = useState<string | null>(null)

  // Validate JSON when value changes
  useEffect(() => {
    if (!value.trim()) {
      setError(null)
      return
    }

    try {
      JSON.parse(value)
      setError(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Invalid JSON")
      }
    }
  }, [value])

  return (
    <div className="space-y-2">
      <Textarea
        placeholder='{"example": "Enter your JSON specification here"}'
        className="min-h-[200px] font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

