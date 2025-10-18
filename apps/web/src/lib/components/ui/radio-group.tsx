import React from 'react'

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface RadioGroupItemProps {
  value: string
  id: string
  disabled?: boolean
  className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  children,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`} role="radiogroup">
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange?.(child.props.value)
        })
      }
      return child
    })}
  </div>
)

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  disabled = false,
  className = ''
}) => (
  <input
    type="radio"
    value={value}
    id={id}
    disabled={disabled}
    className={`w-4 h-4 ${className}`}
  />
)