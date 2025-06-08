# FinSight - Personal Finance Tracker

A comprehensive personal finance application built with Next.js that helps users track transactions, categorize expenses, set budgets, and gain insights into their spending patterns.

## ✨ Features

- 📊 **Transaction Tracking** - Add and categorize income/expenses
- 📈 **Interactive Charts** - Monthly overview, category breakdowns, budget comparisons
- 💰 **Budget Management** - Set budgets and track spending against limits
- 🎯 **Smart Insights** - Get personalized spending alerts and recommendations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔄 **Real-time Updates** - Live dashboard updates as you add transactions

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **Charts:** Recharts
- **Containerization:** Docker
- **Form Handling:** React Hook Form + Zod validation

## 📋 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

Verify your installations:
```bash
node --version    # Should show v18+
npm --version     # Should show 9+
docker --version  # Should show Docker version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finsight.git
cd finsight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://finsight_user:finsight_password@localhost:5432/finsight_db?schema=public"

# Next.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Start the Database

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify the container is running
docker ps
```

### 5. Database Setup

```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with initial categories
npm run seed
```

### 6. Start the Application

```bash
# Start the development server
npm run dev
```

🎉 **Your app is now running!**
- **Main App:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard

## 📁 Project Structure

```
finsight/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard page
│   │   └── ...
│   ├── components/
│   │   ├── charts/           # Chart components
│   │   ├── forms/            # Form components
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utilities and database
│   └── types/                # TypeScript definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── docker-compose.yml        # PostgreSQL setup
└── package.json
```

## 🎯 Usage Guide

### Adding Your First Transaction

1. Navigate to the **Dashboard** (http://localhost:3000/dashboard)
2. Use the **"Add Transaction"** form on the right side
3. Fill in:
   - **Type:** Income or Expense
   - **Amount:** Transaction amount
   - **Description:** What this transaction was for
   - **Date:** When it occurred
   - **Category:** Select from predefined categories
4. Click **"Add Transaction"**

### Setting Up Budgets

1. In the Dashboard, click the **"Set Budget"** tab
2. Enter your budget amount for a specific category and month
3. Click **"Set Budget"**
4. View budget vs actual spending in the charts

### Understanding the Charts

- **Monthly Overview:** Bar chart showing income vs expenses by month
- **Expenses by Category:** Pie chart breaking down spending categories
- **Budget vs Actual:** Comparison of budgeted vs actual spending
- **Spending Insights:** Smart alerts and recommendations

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker-compose logs postgres

# Reset database (⚠️ This will delete all data)
docker-compose down -v
docker-compose up -d
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# View database in Prisma Studio
npx prisma studio

# Reset and reseed database
npx prisma migrate reset
npm run seed

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Database Management

### Prisma Studio
Access your database with a visual interface:
```bash
npx prisma studio
```
This opens a web interface at http://localhost:5555

### Adding New Categories
Categories are seeded automatically, but you can add more by modifying `prisma/seed.ts` and running:
```bash
npm run seed
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `DATABASE_URL` (your production PostgreSQL URL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. **Run Production Migrations:**
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

### Production Database Options
- [Vercel Postgres](https://vercel.com/storage/postgres) (recommended)
- [Supabase](https://supabase.com/) (free tier available)
- [PlanetScale](https://planetscale.com/) (MySQL-compatible)
- [Railway](https://railway.app/) (PostgreSQL hosting)

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check if Docker is running
docker ps

# Restart the database container
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

**Port Already in Use:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Prisma Issues:**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database if corrupted
npx prisma migrate reset
npm run seed
```

**Dependencies Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Look through existing [Issues](https://github.com/yourusername/finsight/issues)
3. Create a new issue with detailed information about your problem

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Recharts](https://recharts.org/) - Charting library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Happy budgeting! 💰**
