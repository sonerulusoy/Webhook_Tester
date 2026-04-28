import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Zap } from 'lucide-react';
import Input from '../components/SharedComponents/Input';
import Button from '../components/SharedComponents/Button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      // Dummy login success
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 mb-6 shadow-xl shadow-primary/20">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-textMuted">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <a href="#" className="text-xs text-primary hover:text-primaryHover transition-colors">Forgot?</a>
            }
          />

          <Button
            type="submit"
            isLoading={loading}
            icon={ArrowRight}
            className="w-full mt-4"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-textMuted mt-8">
          Don't have an account?{' '}
          <a href="#" className="text-primary hover:text-primaryHover font-medium transition-colors">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
