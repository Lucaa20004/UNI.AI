import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/features/layout/Navbar";
import { StartWindow } from "@/features/windows/StartWindow";
import { ChatWindow } from "@/features/windows/ChatWindow";
import { ProfileWindow } from "@/features/windows/ProfileWindow";
import { SettingsWindow } from "@/features/windows/SettingsWindow";
import { SubscriptionWindow } from "@/features/windows/SubscriptionWindow";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthProvider } from "@/components/auth/AuthContext";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <Routes>
                  <Route path="/" element={<StartWindow />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/chat" element={<ChatWindow />} />
                  <Route path="/profile" element={<ProfileWindow />} />
                  <Route path="/settings" element={<SettingsWindow />} />
                  <Route path="/subscription" element={<SubscriptionWindow />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;