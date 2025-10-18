import React, { useState } from 'react'

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const value = controlledValue !== undefined ? controlledValue : internalValue

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            value,
            onValueChange: controlledValue !== undefined ? onValueChange : setInternalValue
          })
        }
        return child
      })}
    </div>
  )
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => (
  <div className={`flex space-x-1 border-b ${className}`}>{children}</div>
)

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => (
  <button
    className={`px-4 py-2 font-medium transition-colors ${
      className
    }`}
    onClick={() => {
      const parent = React.useContext(TabsContext)
      parent?.onValueChange?.(value)
    }}
  >
    {children}
  </button>
)

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const parent = React.useContext(TabsContext)

  if (parent?.value !== value) {
    return null
  }

  return <div className={`p-4 ${className}`}>{children}</div>
}

const TabsContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
} | null>(null)