'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from '@/types'

const BudgetFormSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  categoryId: z.string().min(1, 'Category is required'),
})

type BudgetFormData = z.infer<typeof BudgetFormSchema>

interface BudgetFormProps {
  onSuccess?: () => void
}

export function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const currentDate = new Date()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(BudgetFormSchema),
    defaultValues: {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    },
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data.filter((cat: Category) => cat.name !== 'Income'))
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const onSubmit = async (data: BudgetFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create budget')
      }

      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create budget:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <Card className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center sm:text-left">
          Set Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 md:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
              Budget Amount (₹)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs sm:text-sm md:text-base">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter budget amount"
                className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                         border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                {...register('amount', { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="month" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                Month
              </Label>
              <Select onValueChange={(value) => setValue('month', parseInt(value))}>
                <SelectTrigger className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                                       border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent className="max-h-48 sm:max-h-60 md:max-h-72">
                  {months.map((month, index) => (
                    <SelectItem 
                      key={index} 
                      value={(index + 1).toString()}
                      className="text-xs sm:text-sm md:text-base py-1.5 sm:py-2"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && (
                <p className="text-xs sm:text-sm text-red-500 mt-1">
                  {errors.month.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="year" className="text-xs sm:text-sm md:text-base font-medium text-gray-700">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                placeholder="Enter year"
                className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 lg:h-11 
                         border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                {...register('year', { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="text-xs sm:text-sm text-red-500 mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>
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
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-8 sm:h-9 md:h-10 lg:h-11 text-xs sm:text-sm md:text-base font-medium 
                     bg-black hover:bg-black text-white rounded-md transition-colors duration-200
                     disabled:bg-gray-400 disabled:cursor-not-allowed" 
            disabled={isLoading}
          >
            {isLoading ? 'Setting Budget...' : 'Set Budget'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}