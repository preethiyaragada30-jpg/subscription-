import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      // Save user session details in localStorage
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error: any) {
      // Offline fallback: check local storage if backend is down
      if (!error.response) {
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const foundUser = localUsers.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          localStorage.setItem("currentUser", JSON.stringify(foundUser));
          navigate("/dashboard");
          return;
        } else if (email === "admin@example.com" && password === "admin") {
          // Default mock admin account
          const defaultAdmin = {
            id: "local_admin",
            firstName: "Deepika",
            lastName: "",
            email: "admin@example.com",
            phone: "7569138706",
            age: 25,
          };
          localStorage.setItem("currentUser", JSON.stringify(defaultAdmin));
          navigate("/dashboard");
          return;
        } else {
          alert("Invalid email or password (Offline Mode)");
          return;
        }
      }
      const errMsg = error.response?.data?.message || error.response?.data?.error || "Login failed. Please check your credentials.";
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
            <ShieldCheck size={28} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Subscription Manager
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  placeholder="admin@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                  autoComplete="username"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
                  Register
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                Sign In <ArrowRight size={18} />
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;