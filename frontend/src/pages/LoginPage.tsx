import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      setAuth(
        {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
        },
        response.data.token,
      );
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid credentials or server error.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text selection:bg-primary selection:text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-light/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-surface/90 backdrop-blur-xl border border-border rounded-3xl shadow-xl z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 shadow-sm shadow-primary/20">
            <LogIn size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-text-muted mt-2 text-sm">
            Sign in to your ShoeStore account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl text-primary-dark text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-text-muted outline-none text-text"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-text-muted outline-none text-text"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
