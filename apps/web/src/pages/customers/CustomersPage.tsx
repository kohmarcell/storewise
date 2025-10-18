import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { Users } from 'lucide-react'

function CustomersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">Manage customers and loyalty programs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Customer management interface coming soon...</p>
            <p className="text-sm">This will include customer profiles and loyalty tracking</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersPage