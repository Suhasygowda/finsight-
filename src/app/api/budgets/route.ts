import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const BudgetSchema = z.object({
  amount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  categoryId: z.string().cuid(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    let whereClause = {}
    
    if (month && year) {
      whereClause = {
        month: parseInt(month),
        year: parseInt(year),
      }
    }

    const budgets = await prisma.budget.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: 'asc',
        },
      },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = BudgetSchema.parse(body)

    const budget = await prisma.budget.upsert({
      where: {
        categoryId_month_year: {
          categoryId: validatedData.categoryId,
          month: validatedData.month,
          year: validatedData.year,
        },
      },
      update: {
        amount: validatedData.amount,
      },
      create: validatedData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create/update budget' },
      { status: 500 }
    )
  }
}