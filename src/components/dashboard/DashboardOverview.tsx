'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'
import { Transaction } from '@/types'

interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  transactionCount: number
}

export function DashboardOverview({ refresh }: { refresh?: number }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [refresh])

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true)
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      const response = await fetch(`/api/transactions?month=${currentMonth}&year=${currentYear}`)
      const transactions: Transaction[] = await response.json()

      const stats = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.totalIncome += transaction.amount
          } else {
            acc.totalExpenses += transaction.amount
          }
          acc.transactionCount++
          return acc
        },
        { totalIncome: 0, totalExpenses: 0, balance: 0, transactionCount: 0 }
      )

      stats.balance = stats.totalIncome - stats.totalExpenses
      setStats(stats)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format currency in Indian Rupees with proper formatting
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    })}`
  }

  // Format large numbers with K, L abbreviations for better mobile display
  const formatCompactCurrency = (value: number) => {
    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`
    } else if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`
    } else if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`
    }
    return formatCurrency(value)
  }

  // Determine display format based on screen size
  const getDisplayValue = (value: number, isTransaction: boolean = false) => {
    if (isTransaction) {
      return value.toString()
    }
    
    // Use compact format for mobile screens with large numbers
    if (typeof window !== 'undefined' && window.innerWidth < 640 && Math.abs(value) >= 10000) {
      return formatCompactCurrency(value)
    }
    
    return formatCurrency(value)
  }

  const statCards = [
    {
      title: 'Total Income',
      value: getDisplayValue(stats.totalIncome),
      fullValue: formatCurrency(stats.totalIncome),
      Icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Total Expenses',
      value: getDisplayValue(stats.totalExpenses),
      fullValue: formatCurrency(stats.totalExpenses),
      Icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Balance',
      value: getDisplayValue(stats.balance),
      fullValue: formatCurrency(stats.balance),
      Icon: DollarSign,
      color: stats.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: stats.balance >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: stats.balance >= 0 ? 'border-green-200' : 'border-red-200',
    },
    {
      title: 'Transactions',
      value: getDisplayValue(stats.transactionCount, true),
      fullValue: `${stats.transactionCount} transactions`,
      Icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">
                Loading...
              </CardTitle>
              <div className="bg-gray-200 p-2 rounded-full">
                <div className="h-3 w-3 sm:h-4 sm:w-4 bg-gray-300 rounded"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="h-6 sm:h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-100 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {statCards.map(({ title, value, fullValue, Icon, color, bgColor, borderColor }, index) => (
        <Card 
          key={index} 
          className={`hover:shadow-md transition-all duration-200 border-l-4 ${borderColor} group`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {title}
            </CardTitle>
            <div className={`${bgColor} p-1.5 sm:p-2 rounded-full group-hover:scale-110 transition-transform`}>
              <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div 
              className={`text-lg sm:text-2xl font-bold ${color} group-hover:scale-105 transition-transform origin-left`}
              title={fullValue}
            >
              {value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}