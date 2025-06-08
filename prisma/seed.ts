import { PrismaClient } from '../src/generated/prisma'


const prisma = new PrismaClient()

async function main() {
   const categories = [
    { name: 'Food & Dining', color: '#EF4444', icon: 'Utensils' },
    { name: 'Transportation', color: '#3B82F6', icon: 'Car' },
    { name: 'Shopping', color: '#10B981', icon: 'ShoppingBag' },
    { name: 'Entertainment', color: '#F59E0B', icon: 'Film' },
    { name: 'Bills & Utilities', color: '#8B5CF6', icon: 'Receipt' },
    { name: 'Healthcare', color: '#EC4899', icon: 'Heart' },
    { name: 'Income', color: '#06B6D4', icon: 'TrendingUp' },
    { name: 'Education', color: '#F97316', icon: 'BookOpen' },
    { name: 'Travel', color: '#84CC16', icon: 'Plane' },
    { name: 'Fitness', color: '#22D3EE', icon: 'Dumbbell' },
    { name: 'Investment', color: '#A855F7', icon: 'TrendingUp' },
    { name: 'Insurance', color: '#EF4444', icon: 'Shield' },
    { name: 'Gifts', color: '#F59E0B', icon: 'Gift' },
    { name: 'Personal Care', color: '#EC4899', icon: 'Sparkles' },
    { name: 'Home & Garden', color: '#10B981', icon: 'Home' },
    { name: 'Technology', color: '#6366F1', icon: 'Smartphone' },
    { name: 'Clothing', color: '#8B5CF6', icon: 'Shirt' },
    { name: 'Pets', color: '#F59E0B', icon: 'Heart' },
    { name: 'Charity', color: '#10B981', icon: 'Heart' },
    { name: 'Business', color: '#3B82F6', icon: 'Briefcase' },
    { name: 'Taxes', color: '#EF4444', icon: 'Calculator' },
    { name: 'Subscriptions', color: '#8B5CF6', icon: 'CreditCard' },
    { name: 'Savings', color: '#10B981', icon: 'PiggyBank' },
    { name: 'Emergency Fund', color: '#EF4444', icon: 'AlertTriangle' },
    { name: 'Miscellaneous', color: '#6B7280', icon: 'MoreHorizontal' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })