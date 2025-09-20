import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Search, Filter, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// Import AssureX logo
import assureXLogo from '@/assets/logo.svg';
interface NavbarProps {
  userRole: 'consumer' | 'official' | 'admin';
  userName: string;
  onLogout: () => void;
}
const Navbar = ({
  userRole,
  userName,
  onLogout
}: NavbarProps) => {
  const location = useLocation();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigationItems = [{
    name: 'Dashboard',
    path: '/dashboard'
  }, {
    name: 'Scanner',
    path: '/scanner'
  }, {
    name: 'Violations',
    path: '/violations'
  }, {
    name: 'Products',
    path: '/products'
  }, {
    name: 'Reports',
    path: '/reports'
  }];
  const roleDisplay = {
    consumer: 'Consumer',
    official: 'Compliance Official',
    admin: 'Compliance Admin'
  };
  return <motion.nav initial={{
    y: -100,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1]
  }} className="sticky top-4 z-50 mx-4">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-2 border-border/40 hover:border-primary/30 rounded-2xl backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16),0_4px_16px_rgba(0,0,0,0.12)] px-4 sm:px-6 lg:px-8 ring-1 ring-white/20 hover:ring-primary/20 transition-all duration-500 ease-out">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex items-center space-x-3 group" whileHover={{
          scale: 1.02
        }} transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}>
            <div className="relative flex items-center p-2 rounded-xl bg-muted/50 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
              <img src={assureXLogo} alt="AssureX Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-foreground">AssureX </div>
              
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => <motion.div key={item.name} initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.05 * index + 0.1
          }}>
                <Link to={item.path} className="relative group">
                  <motion.div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${location.pathname === item.path ? 'text-primary bg-primary/10 shadow-sm border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`} whileHover={{
                scale: 1.02,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 17
                }
              }} whileTap={{
                scale: 0.98
              }}>
                    <span className="relative z-10">{item.name}</span>
                  </motion.div>
                </Link>
              </motion.div>)}
          </div>

          {/* Search Bar */}
          <motion.div className="hidden lg:flex items-center w-64" initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.2
        }}>
            <div className="relative w-full group">
              <div className="relative bg-muted/30 rounded-md border border-border/50 group-focus-within:border-primary/50 transition-all duration-200 shadow-sm group-focus-within:shadow-md">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                
                <Input type="text" placeholder="Search products, brands..." className="pl-8 pr-10 py-2 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/70 focus:ring-0 focus:outline-none text-sm h-8" onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} />
                
                <Button size="sm" variant="ghost" className="absolute right-0.5 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/50 rounded-md">
                  <Filter className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Side Actions */}
          <motion.div className="flex items-center" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: 0.3
        }}>
            {/* Actions Container */}
            <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1 border border-border/30 shadow-sm ml-3">
              {/* Notifications */}
              <motion.div className="relative" whileHover={{
              scale: 1.05,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 17
              }
            }} whileTap={{
              scale: 0.95
            }}>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0 hover:bg-background/50 rounded-md my-0 mx-[10px] text-base">
                  <Bell className="h-4 w-4" />
                  <motion.div className="absolute -top-1 -right-1" animate={{
                  scale: [1, 1.1, 1]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
                    <Badge className="h-4 w-4 p-0 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      3
                    </Badge>
                  </motion.div>
                </Button>
              </motion.div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button className="h-8 w-8 rounded-lg hover:bg-background/50 transition-all duration-200 group" whileHover={{
                  scale: 1.05,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 17
                  }
                }} whileTap={{
                  scale: 0.95
                }}>
                    <div className="w-8 h-8 bg-primary/90 rounded-lg flex items-center justify-center shadow-sm border border-primary/20">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background/95 backdrop-blur-xl border-border/50 shadow-lg rounded-lg p-1" align="end">
                  <div className="p-3 bg-muted/50 rounded-md mb-1">
                    <DropdownMenuLabel className="text-foreground font-semibold text-sm">My Account</DropdownMenuLabel>
                    <div className="text-xs text-muted-foreground mt-1">{userName} • {roleDisplay[userRole]}</div>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 rounded-md p-2 text-sm">
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 rounded-md p-2 text-sm">
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 rounded-md p-2 text-sm">
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 transition-colors duration-200 font-medium rounded-md p-2 text-sm">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <motion.div className="md:hidden ml-2" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <motion.div animate={{
                rotate: isMobileMenuOpen ? 180 : 0
              }} transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}>
                  {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }} className="md:hidden border-t border-border/30 mt-4 pt-4 pb-4 bg-background/95 backdrop-blur-xl">
            <div className="space-y-1">
              {navigationItems.map((item, index) => <motion.div key={item.name} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: index * 0.05
          }}>
                  <Link to={item.path} className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${location.pathname === item.path ? 'text-primary bg-primary/10 border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>)}
            </div>
            
            {/* Mobile Search */}
            <motion.div className="mt-4 pt-4 border-t border-border/30" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2
        }}>
              <div className="relative">
                <div className="bg-muted/30 rounded-lg border border-border/50">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Search products, brands..." className="pl-10 py-2.5 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/70 focus:ring-0 focus:outline-none text-sm" />
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navbar;