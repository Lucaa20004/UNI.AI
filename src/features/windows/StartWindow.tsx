import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthContext";

export function StartWindow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleStartChat = () => {
    if (user) {
      navigate("/chat");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">      
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to UNI AI
        </h1>
        
        <div className="space-y-4">
          <Button 
            size="lg"
            onClick={handleStartChat}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Start Chat
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}