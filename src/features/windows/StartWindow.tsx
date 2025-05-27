import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function StartWindow() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">      
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to UNI AI
        </h1>
        
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