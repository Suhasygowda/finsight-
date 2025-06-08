'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { Budget, Transaction } from '@/types'

interface Insight {
  type: 'warning' | 'info' | 'success'
  title: string
  description: string
  icon: React.ComponentType<any>
}

export function SpendingInsights({ refresh }: { refresh: number }) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateInsights()
  }, [refresh]) 

  const generateInsights = async () => {
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
          const categoryName = transaction.category.name
          acc[categoryName] = (acc[categoryName] || 0) + transaction.amount
          return acc
        }, {} as Record<string, number>)

      const newInsights: Insight[] = []

      budgets.forEach(budget => {
        const spent = expensesByCategory[budget.category.name] || 0
        const percentage = (spent / budget.amount) * 100

        if (spent > budget.amount) {
          newInsights.push({
            type: 'warning',
            title: `Over Budget: ${budget.category.name}`,
            description: `You've spent ₹${spent.toFixed(2)} out of ₹${budget.amount.toFixed(2)} (${percentage.toFixed(0)}%)`,
            icon: AlertTriangle,
          })
        } else if (percentage > 80) {
          newInsights.push({
            type: 'info',
            title: `Approaching Budget Limit: ${budget.category.name}`,
            description: `You've spent ${percentage.toFixed(0)}% of your budget for ${budget.category.name}`,
            icon: Target,
          })
        }
      })

      const topCategory = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)[0]

      if (topCategory) {
        newInsights.push({
          type: 'info',
          title: 'Top Spending Category',
          description: `${topCategory[0]} is your highest expense this month (₹${topCategory[1].toFixed(2)})`,
          icon: TrendingUp,
        })
      }

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100

        if (savingsRate > 20) {
          newInsights.push({
            type: 'success',
            title: 'Great Savings Rate!',
            description: `You're saving ${savingsRate.toFixed(1)}% of your income this month`,
            icon: Target,
          })
        } else if (savingsRate < 5) {
          newInsights.push({
            type: 'warning',
            title: 'Low Savings Rate',
            description: `Your savings rate is just ${savingsRate.toFixed(1)}%. Consider reviewing expenses.`,
            icon: AlertTriangle,
          })
        }
      }

      setInsights(newInsights)
    } catch (error) {
      console.error('Failed to generate insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Spending Insights</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="flex items-center justify-center p-4 sm:p-8">
            <div className="text-sm sm:text-base text-muted-foreground">
              Analyzing your spending patterns...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-3 sm:space-y-4">
          {insights.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 sm:py-8">
              <div className="text-sm sm:text-base">
                Add more transactions and budgets to see insights
              </div>
            </div>
          ) : (
            insights.map((insight, index) => (
              <Alert 
                key={index} 
                className={`border-l-4 ${
                  insight.type === 'warning' ? 'border-l-red-500' :
                  insight.type === 'success' ? 'border-l-green-500' :
                  'border-l-blue-500'
                }`}
              >
                <insight.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <span className="font-semibold text-sm sm:text-base leading-tight">
                      {insight.title}
                    </span>
                    <Badge 
                      variant={insight.type === 'warning' ? 'destructive' : 'default'}
                      className="self-start text-xs"
                    >
                      {insight.type}
                    </Badge>
                  </div>
                  <AlertDescription className="text-xs sm:text-sm leading-relaxed">
                    {insight.description}
                  </AlertDescription>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}