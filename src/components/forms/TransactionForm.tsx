'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from '@/types'

const TransactionFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
})

type TransactionFormData = z.infer<typeof TransactionFormSchema>

interface TransactionFormProps {
  onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const transactionType = watch('type')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
          date: new Date(data.date).toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create transaction')
      }

      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center sm:text-left">
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 md:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                Type
              </Label>
              <Select
                value={transactionType}
                onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
              >
                <SelectTrigger className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                                       border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense" className="text-xs sm:text-sm md:text-base py-1.5 sm:py-2">
                    Expense
                  </SelectItem>
                  <SelectItem value="income" className="text-xs sm:text-sm md:text-base py-1.5 sm:py-2">
                    Income
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs sm:text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="amount" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                Amount (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs sm:text-sm md:text-base">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                           border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                  {...register('amount', { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className="text-xs sm:text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter transaction description..."
              className="text-xs sm:text-sm md:text-base min-h-16 sm:min-h-20 md:min-h-24 resize-none
                       border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
              rows={3}
            />
            {errors.description && (
              <p className="text-xs sm:text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="date" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                Date
              </Label>
              <Input 
                id="date" 
                type="date" 
                {...register('date')} 
                className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                         border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
              />
              {errors.date && (
                <p className="text-xs sm:text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                Category
              </Label>
              <Select onValueChange={(value) => setValue('categoryId', value)}>
                <SelectTrigger className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                                       border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-48 sm:max-h-60 md:max-h-72">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="text-xs sm:text-sm md:text-base py-1.5 sm:py-2"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs sm:text-sm text-red-500">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-8 sm:h-9 md:h-10 lg:h-11 text-xs sm:text-sm md:text-base font-medium 
                     bg-black hover:bg-black text-white rounded-md transition-colors duration-200
                     disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 sm:mt-6" 
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}