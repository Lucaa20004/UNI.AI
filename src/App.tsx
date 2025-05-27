import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/features/layout/Navbar";
import { StartWindow } from "@/features/windows/StartWindow";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ChatWindow } from "@/features/windows/ChatWindow";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { SubscriptionsPage } from "@/features/subscriptions/SubscriptionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<StartWindow />} />
                <Route
                  path="*"
                  element={
                    <>
                      <Navbar />
                      <Routes>
                        <Route path="/login\" element={<LoginForm />} />
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route path="/chat" element={
                          <ProtectedRoute>
                            <ChatWindow />
                          </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                          <ProtectedRoute requiredRole="user">
                            <ProfilePage />
                          </ProtectedRoute>
                        } />
                        <Route path="/subscriptions" element={
                          <ProtectedRoute requiredRole="admin">
                            <SubscriptionsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </>
                  }
                />
              </Routes>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;