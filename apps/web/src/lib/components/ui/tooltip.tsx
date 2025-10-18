import React, { useState } from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  delay?: number
}

interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children, delayDuration = 0 }) => {
  return <>{children}</>
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeout, setTimeout] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    if (timeout) clearTimeout(timeout)
    if (delay > 0) {
      const newTimeout = setTimeout(() => setIsVisible(true), delay)
      setTimeout(newTimeout)
    } else {
      setIsVisible(true)
    }
  }

  const hideTooltip = () => {
    if (timeout) clearTimeout(timeout)
    setIsVisible(false)
  }

  return (
    <div className="relative inline-block"
         onMouseEnter={showTooltip}
         onMouseLeave={hideTooltip}>
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  )
}

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  return <>{children}</>
}

export const TooltipContent: React.FC<TooltipContentProps> = ({ children }) => {
  return <>{children}</>
}