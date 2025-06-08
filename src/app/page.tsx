"use client"

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Shield, 
  Smartphone, 
  BarChart3,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const [stats, setStats] = useState({
    activeUsers: '10K+',
    transactionsTracked: '1M+',
    moneySaved: '$50M+',
    categories: '25+'
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats({
            activeUsers: data.activeUsers,
            transactionsTracked: data.transactionsTracked,
            moneySaved: data.moneySaved,
            categories: data.categories
          })
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Keep default stats if API fails
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: TrendingUp,
      title: 'Transaction Tracking',
      description: 'Effortlessly track your income and expenses with smart categorization and real-time updates.',
    },
    {
      icon: PieChart,
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs help you understand your spending patterns at a glance.',
    },
    {
      icon: Target,
      title: 'Budget Management',
      description: 'Set monthly budgets by category and get alerts when you\'re approaching your limits.',
    },
    {
      icon: BarChart3,
      title: 'Spending Insights',
      description: 'AI-powered insights help you identify trends and optimize your financial habits.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely with industry-standard protection.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access your financial dashboard anywhere, anytime with our mobile-optimized interface.',
    },
  ]

  const statsData = [
    { label: 'Active Users', value: stats.activeUsers },
    { label: 'Transactions Tracked', value: stats.transactionsTracked },
    { label: 'Money Saved', value: stats.moneySaved },
    { label: 'Categories', value: stats.categories },
  ]

  const benefits = [
    'Track expenses across multiple categories',
    'Set and monitor monthly budgets',
    'Get personalized spending insights',
    'Mobile-first responsive design',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">FinSight</span>
          </div>
          <div className="flex items-center space-x-4">
            
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Dashboard
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-1" />
            Personal Finance Made Simple
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Take Control of Your
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Financial Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            FinSight helps you track expenses, set budgets, and gain valuable insights into your spending habits. 
            Make smarter financial decisions with our intuitive dashboard and powerful analytics.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center">
              Start Tracking Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl md:text-4xl font-bold text-gray-900 mb-2 ${isLoading ? 'animate-pulse' : ''}`}>
                {isLoading ? '...' : stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        {!isLoading && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live data updated in real-time
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you understand, control, and optimize your financial life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose FinSight?
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Join thousands of users who have transformed their financial habits with our comprehensive 
                personal finance tracking platform.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Free Forever</div>
                <div className="text-blue-100 mb-6">No hidden fees, no subscriptions</div>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start tracking your expenses, setting budgets, and gaining insights today. 
            It takes less than 2 minutes to get started.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto">
            Launch Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">FinSight</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Empowering individuals to make smarter financial decisions through 
                intuitive tracking, budgeting, and insights.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Dashboard</a></li>
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 FinSight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}