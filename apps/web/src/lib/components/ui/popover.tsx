import React, { useState } from 'react'

interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface PopoverTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
}

export const Popover: React.FC<PopoverProps> = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen

  return (
    <PopoverContext.Provider value={{ isOpen, onOpenChange: onOpenChange || setInternalOpen }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild = false }) => {
  const { onOpenChange } = React.useContext(PopoverContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => onOpenChange?.(true)
    })
  }

  return <div onClick={() => onOpenChange?.(true)}>{children}</div>
}

export const PopoverContent: React.FC<PopoverContentProps> = ({ children, className = '', align = 'center' }) => {
  const { isOpen, onOpenChange } = React.useContext(PopoverContext)

  if (!isOpen) {
    return null
  }

  return (
    <div className={`absolute z-50 bg-white border rounded-lg shadow-lg p-4 ${className}`}
         onClick={(e) => e.stopPropagation()}>
      {children}
      <button onClick={() => onOpenChange?.(false)} className="absolute top-2 right-2 text-gray-500">
        ×
      </button>
    </div>
  )
}

const PopoverContext = React.createContext<{
  isOpen: boolean
  onOpenChange?: (open: boolean) => void
}>({ isOpen: false })