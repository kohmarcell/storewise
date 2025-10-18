import React from 'react'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className = ''
}) => (
  <div
    className={`${
      orientation === 'horizontal'
        ? 'w-full h-px border-t'
        : 'h-full w-px border-l'
    } ${className}`}
  />
)