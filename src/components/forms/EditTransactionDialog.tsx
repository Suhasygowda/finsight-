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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Category, Transaction } from '@/types'

const EditTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
})

type EditTransactionData = z.infer<typeof EditTransactionSchema>

interface EditTransactionDialogProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function EditTransactionDialog({ 
  transaction, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditTransactionDialogProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditTransactionData>({
    resolver: zodResolver(EditTransactionSchema),
  })

  const transactionType = watch('type')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (transaction && isOpen) {
      // Populate form with transaction data
      setValue('amount', transaction.amount)
      setValue('description', transaction.description)
      setValue('date', new Date(transaction.date).toISOString().split('T')[0])
      setValue('type', transaction.type)
      setValue('categoryId', transaction.categoryId)
    }
  }, [transaction, isOpen, setValue])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const onSubmit = async (data: EditTransactionData) => {
    if (!transaction) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update transaction')
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Failed to update transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Type and Amount Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Type
              </Label>
              <Select
                value={transactionType}
                onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs sm:text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-8 h-10"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                />
              </div>
              {errors.amount && (
                <p className="text-xs sm:text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              rows={3}
              className="resize-none"
              {...register('description')}
              placeholder="Enter transaction description..."
            />
            {errors.description && (
              <p className="text-xs sm:text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Date and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input 
                id="date" 
                type="date" 
                className="h-10"
                {...register('date')} 
              />
              {errors.date && (
                <p className="text-xs sm:text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select 
                value={watch('categoryId')} 
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
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

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto h-10 sm:h-9"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto h-10 sm:h-9"
            >
              {isLoading ? 'Updating...' : 'Update Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}