'use client'

import { useState } from 'react'
import Layout from '@/components/Layout' 
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { TransactionForm } from '@/components/forms/TransactionForm'
import { BudgetForm } from '@/components/forms/BudgetForm'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { MonthlyExpenseChart } from '@/components/charts/MonthlyExpenseChart'
import { CategoryPieChart } from '@/components/charts/CategoryPieChart'
import { BudgetComparisonChart } from '@/components/charts/BudgetComparisonChart'
import { SpendingInsights } from '@/components/dashboard/SpendingInsights'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        </div>

        <DashboardOverview refresh={refreshKey} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MonthlyExpenseChart refresh={refreshKey} />
          <CategoryPieChart refresh={refreshKey} />
          <BudgetComparisonChart refresh={refreshKey} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SpendingInsights refresh={refreshKey} />
          </div>
          <div>
            <Tabs defaultValue="transaction" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transaction">Add Transaction</TabsTrigger>
                <TabsTrigger value="budget">Set Budget</TabsTrigger>
              </TabsList>
              <TabsContent value="transaction">
                <TransactionForm onSuccess={handleSuccess} />
              </TabsContent>
              <TabsContent value="budget">
                <BudgetForm onSuccess={handleSuccess} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <TransactionList onTransactionUpdate={handleSuccess} refresh={refreshKey} />
      </div>
    </Layout>
  )
}