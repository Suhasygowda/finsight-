'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/types'

interface MonthlyData {
  month: string
  expenses: number
  income: number
}

export function MonthlyExpenseChart({ refresh }: { refresh: number }) {
  const [data, setData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMonthlyData()
  }, [refresh])

  const fetchMonthlyData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/transactions')
      const transactions: Transaction[] = await response.json()

      const monthlyData = transactions.reduce((acc, transaction) => {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'short' })

        if (!acc[month]) {
          acc[month] = { month, expenses: 0, income: 0 }
        }

        if (transaction.type === 'expense') {
          acc[month].expenses += transaction.amount
        } else {
          acc[month].income += transaction.amount
        }

        return acc
      }, {} as Record<string, MonthlyData>)

      setData(Object.values(monthlyData))
    } catch (error) {
      console.error('Failed to fetch monthly data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTooltip = (value: number, name: string) => {
    return [`₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, name]
  }

  const formatYAxisTick = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`
    }
    return `₹${value}`
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 sm:h-80">
            <div className="text-sm sm:text-base text-gray-600">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 sm:h-80 text-gray-500">
            <div className="text-sm sm:text-base">No transactions available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={250} className="sm:!h-80 md:!h-96">
            <BarChart 
              data={data} 
              margin={{ 
                top: 10, 
                right: 10, 
                left: 10, 
                bottom: 10 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                className="text-xs sm:text-sm"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-xs sm:text-sm"
                tickFormatter={formatYAxisTick}
                width={60}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar 
                dataKey="income" 
                fill="#10B981" 
                name="Income"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              />
              <Bar 
                dataKey="expenses" 
                fill="#EF4444" 
                name="Expenses"
                radius={[2, 2, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}