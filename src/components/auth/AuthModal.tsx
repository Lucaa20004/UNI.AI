import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        {mode === 'login' ? (
          <LoginForm onModeChange={() => setMode('signup')} />
        ) : (
          <SignUpForm onModeChange={() => setMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
}