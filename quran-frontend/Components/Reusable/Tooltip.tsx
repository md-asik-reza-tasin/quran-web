"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CustomTooltipProps {
  children: React.ReactNode
  content: string
  side?: "top" | "right" | "bottom" | "left"
  delayDuration?: number
}

/**
 * A reusable tooltip wrapper that defaults to the 'right' side
 * for sidebar navigation.
 */
export default function CustomTooltip({
  children,
  content,
  side = "right",
  delayDuration = 200,
}: CustomTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          // Using your Tailwind v4 'primary' color
          className="bg-primary text-white font-medium shadow-lg border-none animate-in fade-in zoom-in-95 data-[side=right]:slide-in-from-left-2"
        >
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}