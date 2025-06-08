export interface Category {
  id: string
  name: string
  color: string
  icon: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  amount: number
  description: string
  date: Date
  type: 'income' | 'expense'
  categoryId: string
  category: Category
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  amount: number
  month: number
  year: number
  categoryId: string
  category: Category
  createdAt: Date
  updatedAt: Date
}