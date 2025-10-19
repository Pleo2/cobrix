'use client'

import Link from 'next/link'
import Logo from './logo'
import { Button } from '../ui/button'

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex">
     
    
    </nav>
  )
}

function MobileNav() {
  return (
    <header className="lg:hidden">
      
    </header>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  return (
    <header className="flex justify-between pt-12 sm:pt-8 px-12 lg:px-16">
      <Logo className="w-16 h-16" />
      <div className="relative hidden lg:flex justify-between items-center">
        <div className="relative flex gap-6">
          <div className="py-3">
            <Link href="/" title="Home" className='flex justify-center items-center px-6'>
              <Logo />
            </Link>
          </div>
          {banner && (
            <div className="relative hidden items-center py-3 lg:flex">
              {banner}
            </div>
          )}
        </div>
        <DesktopNav />
      </div>
      <MobileNav />
    </header>
  )
}
