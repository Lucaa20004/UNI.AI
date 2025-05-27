import { Link } from "react-router-dom";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link to="/" className="font-semibold text-lg">
          AI Chat Assistant
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <Link 
            to="/chat" 
            className="text-sm hover:text-primary"
          >
            Chat
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}