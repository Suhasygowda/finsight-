'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { Transaction } from '@/types'

interface DeleteConfirmationDialogProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmationDialog({ 
  transaction, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteConfirmationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!transaction) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete transaction')
      }

      onConfirm()
      onClose()
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3 sm:space-y-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
            <span className="truncate">Delete Transaction</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {transaction && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Description:
                </span>
                <span className="text-xs sm:text-sm break-words sm:text-right max-w-full sm:max-w-[200px]">
                  {transaction.description}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Amount:
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Category:
                </span>
                <span className="text-xs sm:text-sm break-words sm:text-right max-w-full sm:max-w-[200px]">
                  {transaction.category.name}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Date:
                </span>
                <span className="text-xs sm:text-sm">
                  {new Date(transaction.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base order-2 sm:order-1"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base font-medium order-1 sm:order-2"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}