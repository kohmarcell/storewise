import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
)

export const TableHeader: React.FC<TableProps> = ({ children, className = '' }) => (
  <thead className={`${className}`}>{children}</thead>
)

export const TableBody: React.FC<TableProps> = ({ children, className = '' }) => (
  <tbody className={`${className}`}>{children}</tbody>
)

export const TableRow: React.FC<TableProps> = ({ children, className = '' }) => (
  <tr className={`border-b ${className}`}>{children}</tr>
)

export const TableHead: React.FC<TableProps> = ({ children, className = '' }) => (
  <th className={`text-left p-2 font-semibold ${className}`}>{children}</th>
)

export const TableCell: React.FC<TableProps> = ({ children, className = '' }) => (
  <td className={`p-2 ${className}`}>{children}</td>
)