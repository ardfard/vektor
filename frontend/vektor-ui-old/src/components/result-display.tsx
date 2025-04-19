"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Copy, Check } from "lucide-react"

interface ResultDisplayProps {
  result: Record<string, unknown>
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false)

  const formattedJson = JSON.stringify(result, null, 2)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analysis Result</CardTitle>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> Copy JSON
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
          <code>{formattedJson}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

