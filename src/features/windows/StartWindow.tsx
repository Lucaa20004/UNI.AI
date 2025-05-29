import { useState, useEffect, useRef } from 'react';
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

  // Refs for sections and elements
  const whatIsRef = useRef(null);
  const whyUseRef = useRef(null);
  const screenshotRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation classes to the main container and its children
            entry.target.classList.add('animate-in');
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-in');
              }, index * 200); // Stagger the animations
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-50px'
      }
    );

    // Observe all sections
    [whatIsRef, whyUseRef, screenshotRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">      
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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

      {/* What is UNI AI Section */}
      <div 
        ref={whatIsRef}
        className="min-h-screen flex items-center px-4 py-16"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="animate-on-scroll text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              What is UNI AI?
            </h2>
            <p className="animate-on-scroll delay-200 text-lg text-gray-700 leading-relaxed">
              UNI AI is your 24/7 intelligent assistant designed specifically for university students. 
              It provides instant, accurate answers to your questions about scholarships, 
              Erasmus programs, application procedures, and university policies.
            </p>
          </div>
          <div className="animate-on-scroll delay-400">
            <img 
              src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg"
              alt="Student using laptop"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Why use UNI AI Section */}
      <div 
        ref={whyUseRef}
        className="min-h-screen flex items-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-on-scroll">
            <img 
              src="https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg"
              alt="Students collaborating"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="animate-on-scroll text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Why use UNI AI?
            </h2>
            <ul className="space-y-4">
              {[
                'Get instant answers to your university-related questions',
                'Available 24/7 to help you with your queries',
                'Access accurate information about scholarships and programs',
                'Save time with quick, reliable responses'
              ].map((text, index) => (
                <li 
                  key={index}
                  className={`animate-on-scroll delay-${(index + 1) * 200} flex items-start text-lg text-gray-700`}
                >
                  <span className="mr-2">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* App Screenshot Section */}
      <div 
        ref={screenshotRef}
        className="min-h-screen flex items-center px-4 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="animate-on-scroll text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            See UNI AI in Action
          </h2>
          <div className="animate-on-scroll delay-200">
            <img 
              src="https://images.pexels.com/photos/8199562/pexels-photo-8199562.jpeg"
              alt="UNI AI Interface"
              className="rounded-lg shadow-2xl mx-auto"
            />
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}