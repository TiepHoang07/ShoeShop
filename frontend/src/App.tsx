import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';

// Protective Wrapper for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Application Home Landing Page (We will expand this later)
const Home = () => {
    const { user, logout } = useAuthStore();
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
             {/* Decorative Background Elements */}
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

            <h1 className="text-5xl font-bold mb-4 tracking-tight">ShoeStore <span className="text-indigo-500">Premium</span></h1>
            <p className="text-xl text-zinc-400 mb-8">You are securely logged in as a <span className="text-indigo-400 font-semibold">{user?.role}</span></p>
            
            <div className="flex gap-4">
                <button onClick={logout} className="px-8 py-3 bg-zinc-800/80 text-zinc-300 backdrop-blur-md border border-zinc-700/50 rounded-xl hover:bg-zinc-800 hover:text-white transition-all">
                    Logout
                </button>
                {user?.role === 'SELLER' && (
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all font-medium">
                        Go to Dashboard
                    </button>
                )}
                {user?.role === 'CUSTOMER' && (
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all font-medium">
                        Browse Shoes
                    </button>
                )}
            </div>
        </div>
    );
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
