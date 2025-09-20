import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ArrowRight, Sun, Moon, Copy, CheckCircle, ShoppingCart, Shield, Settings, Chrome, Mail, KeyRound, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import AssureX logo
import assureXLogo from '@/assets/assurex-logo.png';
import { EvervaultCard } from '@/components/ui/evervault-card';
import { Spotlight } from '@/components/ui/spotlight';

// Spotlight background component
const SpotlightBackground = () => {
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="hsl(var(--primary))" />
      <Spotlight className="-top-40 right-0 md:-top-20 md:right-60" fill="hsl(var(--accent))" />
    </div>;
};
interface LoginFormProps {
  onLogin: (credentials: {
    username: string;
    password: string;
    role: 'consumer' | 'official' | 'admin';
  }) => void;
}
const LoginForm = ({
  onLogin
}: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const {
    theme,
    setTheme
  } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const demoAccounts = [{
    role: 'consumer' as const,
    username: 'Prabh23c',
    password: 'Prabh@123o',
    title: 'Consumer Account',
    description: 'View your flagged products and AI suggestions',
    icon: ShoppingCart,
    color: 'bg-gradient-to-r from-success to-success/80',
    textColor: 'text-success-foreground'
  }, {
    role: 'official' as const,
    username: 'Prabhof',
    password: 'Prabh@123',
    title: 'Official Account',
    description: 'Access violation board and escalation tools',
    icon: Shield,
    color: 'bg-gradient-to-r from-warning to-warning/80',
    textColor: 'text-warning-foreground'
  }, {
    role: 'admin' as const,
    username: 'Prabhad',
    password: 'prabh@123a',
    title: 'Admin Account',
    description: 'User management, rule editor, and audit logs',
    icon: Settings,
    color: 'bg-gradient-to-r from-primary to-primary/80',
    textColor: 'text-primary-foreground'
  }];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with realistic loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success animation
    setLoginSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Determine user role based on username
    let role: 'consumer' | 'official' | 'admin' = 'consumer';
    if (username === 'Prabhof') role = 'official';
    if (username === 'Prabhad') role = 'admin';
    onLogin({
      username,
      password,
      role
    });
    setIsLoading(false);
  };
  const fillDemoCredentials = (demo: typeof demoAccounts[0]) => {
    setUsername(demo.username);
    setPassword(demo.password);
  };
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  if (!mounted) {
    return null;
  }
  return <div className="min-h-screen relative overflow-hidden">
      {/* Spotlight Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <SpotlightBackground />
      </div>

      {/* Theme Toggle */}
      <motion.div className="absolute top-6 right-6 z-50" initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.5
    }}>
        <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="glass-card border-0 glow-on-hover">
          <AnimatePresence mode="wait">
            {theme === 'dark' ? <motion.div key="sun" initial={{
            rotate: -90,
            opacity: 0
          }} animate={{
            rotate: 0,
            opacity: 1
          }} exit={{
            rotate: 90,
            opacity: 0
          }} transition={{
            duration: 0.2
          }}>
                <Sun className="h-4 w-4" />
              </motion.div> : <motion.div key="moon" initial={{
            rotate: 90,
            opacity: 0
          }} animate={{
            rotate: 0,
            opacity: 1
          }} exit={{
            rotate: -90,
            opacity: 0
          }} transition={{
            duration: 0.2
          }}>
                <Moon className="h-4 w-4" />
              </motion.div>}
          </AnimatePresence>
        </Button>
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl flex gap-12 items-center">
          
          {/* Left Side - Enhanced Branding */}
          <motion.div className="hidden lg:flex flex-1 flex-col items-center justify-center text-center relative" initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }}>
            {/* Spotlight Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl" />
            
            <div className="relative z-10">
              {/* EvervaultCard Demo */}
              <motion.div className="mb-8 flex justify-center" initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.6,
              delay: 0.1
            }}>
                
              </motion.div>
              
              {/* Logo with Enhanced Animation */}
              <motion.div className="mb-8 relative" initial={{
              opacity: 0,
              scale: 0.8
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.6,
              delay: 0.2
            }}>
                <motion.div className="relative mx-auto flex items-center justify-center" animate={{
                y: [0, -10, 0],
                rotateY: [0, 5, -5, 0]
              }} transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl rounded-full scale-150" />
                  <img src={assureXLogo} alt="AssureX Logo" className="relative w-64 h-16 object-contain filter drop-shadow-lg" />
                </motion.div>
                
                <motion.p className="text-2xl font-display gradient-text font-semibold mt-4" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.4
              }}>
                  "Ensuring Trust in Every Product"
                </motion.p>
                
                <motion.p className="text-lg text-muted-foreground max-w-lg mx-auto mt-2" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.6
              }}>
                  Automated Compliance Checker for Legal Metrology Declarations on E-Commerce
                </motion.p>
              </motion.div>
              
              {/* Enhanced Feature List */}
              <motion.div className="space-y-6 text-left max-w-lg" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.8
            }}>
                {[{
                icon: Sparkles,
                text: "AI-powered Real-time OCR Scanning"
              }, {
                icon: Shield,
                text: "Advanced Compliance Detection Engine"
              }, {
                icon: KeyRound,
                text: "Automated Violation Reporting & Analytics"
              }].map((feature, index) => <motion.div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-transparent backdrop-blur-sm border border-border/50" initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 1 + index * 0.1
              }} whileHover={{
                x: 10,
                transition: {
                  duration: 0.2
                }
              }}>
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{feature.text}</span>
                  </motion.div>)}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Enhanced Login Form */}
          <motion.div className="flex-1 max-w-lg mx-auto" initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }}>
            <Card className="glass-card border-0 shadow-strong relative overflow-hidden">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
              
              <CardHeader className="text-center pb-4 relative z-10">
                {/* Login/Signup Tabs */}
                <div className="flex justify-center mb-6">
                  <div className="p-1 bg-muted/50 rounded-xl backdrop-blur-sm relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-1 bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow-lg" 
                      initial={false} 
                      animate={{
                        x: activeTab === 'login' ? 4 : 'calc(50% + 4px)',
                        width: 'calc(50% - 8px)'
                      }} 
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        mass: 0.8
                      }} 
                    />
                    <div className="relative flex">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`relative px-8 py-2 text-sm font-medium transition-all duration-200 ${
                          activeTab === 'login' 
                            ? 'text-primary-foreground scale-105' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`} 
                        onClick={() => setActiveTab('login')}
                      >
                        Login
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`relative px-8 py-2 text-sm font-medium transition-all duration-200 ${
                          activeTab === 'signup' 
                            ? 'text-primary-foreground scale-105' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`} 
                        onClick={() => setActiveTab('signup')}
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>

                <CardTitle className="text-3xl font-display gradient-text">
                  {activeTab === 'login' ? 'Welcome Back' : 'Join AssureX'}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {activeTab === 'login' ? 'Sign in to your compliance dashboard' : 'Create your account to get started'}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                  {activeTab === 'login' && <motion.div key="login" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -20
                }} transition={{
                  duration: 0.3
                }}>
                      {/* Demo Accounts Accordion */}
                      <Accordion type="single" collapsible className="mb-6">
                        <AccordionItem value="demo-accounts" className="border-0">
                          <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Demo Accounts
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2">
                            <div className="space-y-3">
                              {demoAccounts.map(demo => {
                            const IconComponent = demo.icon;
                            return <motion.div key={demo.role} className="group p-4 rounded-xl border border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-300 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm" whileHover={{
                              scale: 1.02,
                              y: -2
                            }} whileTap={{
                              scale: 0.98
                            }} onClick={() => fillDemoCredentials(demo)}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${demo.color}`}>
                                          <IconComponent className={`h-4 w-4 ${demo.textColor}`} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-sm">{demo.title}</h4>
                                          </div>
                                          <p className="text-xs text-muted-foreground mb-2">
                                            {demo.description}
                                          </p>
                                          <div className="flex items-center gap-2">
                                            <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                                              {demo.username}
                                            </code>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => {
                                        e.stopPropagation();
                                        copyToClipboard(demo.password, `${demo.role}-password`);
                                      }}>
                                              {copiedField === `${demo.role}-password` ? <CheckCircle className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                  </motion.div>;
                          })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Login Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div className="space-y-2" initial={{
                      opacity: 0,
                      y: 10
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: 0.1
                    }}>
                          <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                            <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300" required />
                          </div>
                        </motion.div>

                        <motion.div className="space-y-2" initial={{
                      opacity: 0,
                      y: 10
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: 0.2
                    }}>
                          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300" required />
                            <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                              <motion.div animate={{
                            rotate: showPassword ? 180 : 0
                          }} transition={{
                            duration: 0.2
                          }}>
                                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </motion.div>
                            </Button>
                          </div>
                        </motion.div>

                        <motion.div initial={{
                      opacity: 0,
                      y: 10
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: 0.3
                    }}>
                          <Button type="submit" className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-all duration-300 relative overflow-hidden group" disabled={isLoading} size="lg">
                            <AnimatePresence mode="wait">
                              {isLoading ? <motion.div key="loading" initial={{
                            opacity: 0
                          }} animate={{
                            opacity: 1
                          }} exit={{
                            opacity: 0
                          }} className="flex items-center gap-2">
                                  <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{
                              rotate: 360
                            }} transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }} />
                                  <span>Signing In...</span>
                                </motion.div> : loginSuccess ? <motion.div key="success" initial={{
                            scale: 0
                          }} animate={{
                            scale: 1
                          }} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Success!</span>
                                </motion.div> : <motion.span key="signin" initial={{
                            opacity: 0
                          }} animate={{
                            opacity: 1
                          }} className="flex items-center gap-2">
                                  Sign In
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </motion.span>}
                            </AnimatePresence>
                          </Button>
                        </motion.div>
                      </form>
                    </motion.div>}

                  {activeTab === 'signup' && <motion.div key="signup" initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -20
                }} transition={{
                  duration: 0.3
                }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                          <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-sm font-medium">Username</Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                          <Input id="signup-username" type="text" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                          <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                          <Input id="confirm-password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300" required />
                        </div>
                      </div>

                      <Button type="submit" className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-all duration-300" size="lg">
                        Create Account
                      </Button>
                    </motion.div>}
                </AnimatePresence>

                {/* OAuth Section */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full glass-card border-0 hover:shadow-medium transition-all duration-300" size="lg">
                  <Chrome className="h-4 w-4 mr-2" />
                  Continue with Google
                </Button>

                {activeTab === 'login' && <div className="text-center">
                    <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
                      Forgot Password?
                    </Button>
                  </div>}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>;
};
export default LoginForm;