import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ViolationsProvider } from "@/contexts/ViolationsContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Violations from "./pages/Violations";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import EvervaultDemo from "./pages/EvervaultDemo";

// Components
import Navbar from "./components/navigation/Navbar";
import LoginForm from "./components/auth/LoginForm";

const queryClient = new QueryClient();

interface User {
  username: string;
  role: 'consumer' | 'official' | 'admin';
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = ({ username, role }: { username: string; password: string; role: 'consumer' | 'official' | 'admin' }) => {
    setUser({ username, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <ViolationsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {!user ? (
                <LoginForm onLogin={handleLogin} />
              ) : (
                <div className="min-h-screen bg-background">
                  <Navbar 
                    userRole={user.role} 
                    userName={user.username}
                    onLogout={handleLogout}
                  />
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard userRole={user.role} />} />
                  <Route path="/scanner" element={<Scanner />} />
                  <Route path="/violations" element={<Violations />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/search" element={<Navigate to="/products" replace />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/evervault-demo" element={<EvervaultDemo />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </div>
              )}
            </BrowserRouter>
          </ViolationsProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;