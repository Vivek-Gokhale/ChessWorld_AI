"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h3>

      <p className="text-slate-600 mb-6">{error || "An unexpected error occurred. Please try again."}</p>

      {onRetry && (
        <Button onClick={onRetry} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
