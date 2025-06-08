'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Budget, Transaction } from '@/types'

interface ComparisonData {
  category: string
  budgeted: number
  actual: number
  remaining: number
}

export function BudgetComparisonChart({ refresh }: { refresh: number }) {
  const [data, setData] = useState<ComparisonData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComparisonData()
  }, [refresh]) 

  const fetchComparisonData = async () => {
    try {
      setIsLoading(true)
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      const [budgetsResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`),
        fetch(`/api/transactions?month=${currentMonth}&year=${currentYear}`)
      ])

      const budgets: Budget[] = await budgetsResponse.json()
      const transactions: Transaction[] = await transactionsResponse.json()

      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, transaction) => {
          acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + transaction.amount
          return acc
        }, {} as Record<string, number>)

      const comparisonData = budgets.map(budget => ({
        category: budget.category.name,
        budgeted: budget.amount,
        actual: expensesByCategory[budget.categoryId] || 0,
        remaining: Math.max(0, budget.amount - (expensesByCategory[budget.categoryId] || 0)),
      }))

      setData(comparisonData)
    } catch (error) {
      console.error('Failed to fetch comparison data:', error)
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

  // Custom label formatter for category names on mobile
  const formatCategoryLabel = (category: string) => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      // Truncate long category names on mobile
      return category.length > 8 ? category.substring(0, 8) + '...' : category
    }
    return category
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Budget vs Actual</CardTitle>
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
          <CardTitle className="text-lg sm:text-xl">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 sm:h-80 text-gray-500">
            <div className="text-sm sm:text-base text-center px-4">
              No budget data available. Set up budgets to see comparisons.
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Budget vs Actual</CardTitle>
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
                bottom: 20 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                className="text-xs sm:text-sm"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tickFormatter={formatCategoryLabel}
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
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
                iconType="rect"
                className="text-xs sm:text-sm"
              />
              <Bar 
                dataKey="budgeted" 
                fill="#3B82F6" 
                name="Budgeted"
                radius={[2, 2, 0, 0]}
                maxBarSize={50}
              />
              <Bar 
                dataKey="actual" 
                fill="#EF4444" 
                name="Actual"
                radius={[2, 2, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Mobile-friendly summary stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:hidden">
          {data.map((item, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-gray-700 mb-1">{item.category}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-600">Budget:</span>
                  <span className="font-medium">₹{item.budgeted.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Actual:</span>
                  <span className="font-medium">₹{item.actual.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={item.actual > item.budgeted ? 'text-red-600' : 'text-green-600'}>
                    {item.actual > item.budgeted ? 'Over:' : 'Left:'}
                  </span>
                  <span className="font-medium">
                    ₹{Math.abs(item.budgeted - item.actual).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}