import { Button } from '@/components/ui/button'
import { DollarSign, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                FinSight
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </nav>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-3 pt-4">
                <Button variant="ghost" className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button className="justify-start" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-theme(spacing.16))]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                  FinSight
                </Link>
              </div>
              <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed">
                Empowering individuals to make smarter financial decisions through 
                intuitive tracking, budgeting, and insights.
              </p>
            </div>

            {/* Product Links */}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li><Link href="#" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-600 text-xs sm:text-sm">
            <p>&copy; 2024 FinSight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}