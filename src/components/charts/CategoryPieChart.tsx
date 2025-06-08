'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/types'

interface CategoryData {
  name: string
  value: number
  color: string
}

export function CategoryPieChart({ refresh }: { refresh: number }) {
  const [data, setData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategoryData()
  }, [refresh])  

  const fetchCategoryData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/transactions?type=expense')
      const transactions: Transaction[] = await response.json()

      const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, transaction) => {
          const categoryName = transaction.category.name

          if (!acc[categoryName]) {
            acc[categoryName] = {
              name: categoryName,
              value: 0,
              color: transaction.category.color,
            }
          }

          acc[categoryName].value += transaction.amount

          return acc
        }, {} as Record<string, CategoryData>)

      setData(Object.values(categoryData))
    } catch (error) {
      console.error('Failed to fetch category data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Custom tooltip formatter with rupees symbol
  const formatTooltip = (value: number) => {
    return [`₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`, 'Amount']
  }

  // Custom label formatter for pie chart
  const formatLabel = ({ name, percent, value }: { name: string; percent: number; value: number }) => {
    // Only show label if percentage is above 5% to avoid clutter on mobile
    if (percent < 0.05) return ''
    
    // Show abbreviated label on small screens
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640
    if (isSmallScreen) {
      return `${(percent * 100).toFixed(0)}%`
    }
    
    return `${name} ${(percent * 100).toFixed(0)}%`
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Expenses by Category</CardTitle>
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
          <CardTitle className="text-lg sm:text-xl">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 sm:h-80 text-gray-500">
            <div className="text-sm sm:text-base">No expense data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={250} className="sm:!h-80 md:!h-96">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="70%"
                innerRadius="20%"
                fill="#8884d8"
                dataKey="value"
                label={formatLabel}
                fontSize={12}
                className="text-xs sm:text-sm"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
                iconType="circle"
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                className="text-xs sm:text-sm"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}