'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, Wrench } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Navigation() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Data Conversion',
      href: '/tools/data-conversion',
      items: [
        { name: 'JSON ↔ YAML', href: '/tools/data-conversion/json-yaml' },
        { name: 'JSON Formatter', href: '/tools/data-conversion/json-formatter' },
      ],
    },
    {
      name: 'Time Tools',
      href: '/tools/time',
      items: [
        { name: 'Timestamp Converter', href: '/tools/time/timestamp-converter' },
      ],
    },
    {
      name: 'Developer Tools',
      href: '/tools/dev',
      items: [
        { name: 'Cron Parser', href: '/tools/dev/cron-parser' },
        { name: 'Cron Generator', href: '/tools/dev/cron-generator' },
      ],
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Wrench className="h-6 w-6" />
              <span className="text-xl font-bold">DevTools Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((category) => (
              <div key={category.name} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname.startsWith(category.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {category.name}
                </Button>
                <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
                  <div className="rounded-md bg-popover shadow-md ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            'block px-4 py-2 text-sm hover:bg-accent',
                            pathname === item.href
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  {category.name}
                </div>
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}