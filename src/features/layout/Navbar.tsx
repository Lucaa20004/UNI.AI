import { Link } from "react-router-dom";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { useAuthContext } from "@/components/auth/AuthContext";

export function Navbar() {
  const { user, profile } = useAuthContext();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to="/" className="font-semibold text-lg">
          AI Chat Assistant
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <>
              <Link 
                to="/chat" 
                className="text-sm hover:text-primary"
              >
                Chat
              </Link>
              
              <Link 
                to="/profile" 
                className="text-sm hover:text-primary"
              >
                Profile
              </Link>
              
              {profile?.role === 'admin' && (
                <Link 
                  to="/subscriptions" 
                  className="text-sm hover:text-primary"
                >
                  Subscriptions
                </Link>
              )}
            </>
          )}
          
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}