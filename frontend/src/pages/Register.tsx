import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Calendar, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !age ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/api/users/register", {
        firstName,
        lastName,
        email,
        phone,
        age: parseInt(age),
        password,
      });

      alert("Registered Successfully");
      navigate("/login");
    } catch (error: any) {
      // Offline fallback: save to localStorage if backend is down
      if (!error.response) {
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        if (localUsers.some((u: any) => u.email === email)) {
          alert("Email address already registered!");
          return;
        }
        const newUser = {
          id: "local_" + Date.now(),
          firstName,
          lastName,
          email,
          phone,
          age: parseInt(age),
          password,
        };
        localUsers.push(newUser);
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
        alert("Registered Successfully (Offline Mode)");
        navigate("/login");
        return;
      }
      const errMsg = error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.";
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
          Register
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="John"
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                    autoComplete="given-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  placeholder="john.doe@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                  autoComplete="username"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    placeholder="+1 (555) 000-0000"
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={age}
                    placeholder="25"
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 py-2.5 border bg-gray-50/50"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                Create account <ArrowRight size={18} />
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
