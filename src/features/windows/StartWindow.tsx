import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/features/theme/ThemeToggle";

export function StartWindow() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to AI Chat Assistant
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Experience intelligent conversations powered by advanced AI. Get instant answers, 
          creative insights, and helpful assistance - all in one place.
        </p>
        
        <Button 
          size="lg"
          onClick={() => navigate("/chat")}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Start Chatting
        </Button>
      </div>
    </div>
  );
}