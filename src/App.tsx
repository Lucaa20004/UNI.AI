const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar /> {/* Moved outside Routes to appear on all pages */}
              <Routes>
                <Route path="/" element={<StartWindow />} />
                <Route path="/login" element={<LoginForm />} />
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
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);