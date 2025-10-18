'use client'

import Link from 'next/link'
import Logo from './logo'
import { Button } from '../ui/button'

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex">
      <Button variant="outline" size="lg" asChild>
        <Link href="/app">
          Ir a la app
        </Link>
      </Button>
    </nav>
  )
}

function MobileNav() {
  return (
    <header className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        <Button variant="outline" asChild>
          <Link href="/app">
            Ir a la app
          </Link>
        </Button>
      </div>
    </header>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  return (
    <header className="pt-12 sm:pt-16 px-0 md:px-8">
      <div className="relative flex justify-between items-center">
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
