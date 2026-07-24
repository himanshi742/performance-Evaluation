import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Key } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }
);
      
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard'); 
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

 
  const autoFill = (testEmail) => {
    setEmail(testEmail);
    setPassword('PilotPass123!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <LogIn className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Aura Feedback</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your company workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      
      <div className="w-full max-w-md mt-6 bg-blue-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-3 text-blue-800 font-semibold">
          <Key className="w-4 h-4" />
          <h2>Pilot Testing Accounts</h2>
        </div>
        <p className="text-xs text-blue-600 mb-4">Click any role to auto-fill the credentials.</p>
        
        <div className="space-y-2">
          <button onClick={() => autoFill('kavita@ashokatextiles.com')} className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200">
            <span className="text-sm font-medium text-blue-900">HR Admin (Ashoka)</span>
            <span className="text-xs font-mono text-blue-700">kavita@...</span>
          </button>
          
          <button onClick={() => autoFill('priya@ashokatextiles.com')} className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200">
            <span className="text-sm font-medium text-blue-900">Manager (Ashoka)</span>
            <span className="text-xs font-mono text-blue-700">priya@...</span>
          </button>

          <button onClick={() => autoFill('team1@ashokatextiles.com')} className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200">
            <span className="text-sm font-medium text-blue-900">Employee (Ashoka)</span>
            <span className="text-xs font-mono text-blue-700">team1@...</span>
          </button>

          <button onClick={() => autoFill('siddharth@brightpath.com')} className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200">
            <span className="text-sm font-medium text-blue-900">Founder (Bright Path)</span>
            <span className="text-xs font-mono text-blue-700">siddharth@...</span>
          </button>
          <button onClick={() => autoFill('amitav@brightpath.com')} className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200">
            <span className="text-sm font-medium text-blue-900">Employee (Bright Path)</span>
            <span className="text-xs font-mono text-blue-700">amitav@...</span>
          </button>
        </div>
        
        <div className="mt-4 pt-3 border-t border-blue-100/50 text-center">
          <span className="text-xs text-blue-600 font-mono">Password for all: PilotPass123!</span>
        </div>
      </div>

    </div>
  );
}