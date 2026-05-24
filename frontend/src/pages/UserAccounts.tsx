import React, { useState, useEffect } from "react";
import { User, Mail, Phone, CreditCard, Shield, Calendar, Edit2, Save, X, Lock, Search } from "lucide-react";
import api from "../services/api";

type InfoProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

// Responsive Info Item component (used to display details in static mode)
const InfoItem = ({ icon, label, value }: InfoProps) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-50/80">
      <div className="text-purple-500 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-bold uppercase text-gray-400 tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
};

const UserAccounts: React.FC<{ setActiveTab?: (tab: string) => void; searchQuery?: string }> = ({ setActiveTab, searchQuery = "" }) => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Customer Directory States
  const [subTab, setSubTab] = useState<"customers" | "profile">("customers");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Fetch saved account information after refresh/login
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.id) {
            // Check if user session is a local fallback session
            if (String(parsed.id).startsWith("local_")) {
              setUser(parsed);
              setFormData({
                firstName: parsed.firstName || "",
                lastName: parsed.lastName || "",
                email: parsed.email || "",
                password: "",
                phone: parsed.phone || "",
                age: parsed.age ? String(parsed.age) : "",
              });
            } else {
              try {
                // Fetch latest database profile from backend
                const response = await api.get(`/api/users/${parsed.id}`);
                const latestUser = {
                  ...response.data,
                  token: parsed.token // Preserve JWT token
                };
                setUser(latestUser);
                localStorage.setItem("currentUser", JSON.stringify(latestUser));
                setFormData({
                  firstName: latestUser.firstName || "",
                  lastName: latestUser.lastName || "",
                  email: latestUser.email || "",
                  password: "",
                  phone: latestUser.phone || "",
                  age: latestUser.age ? String(latestUser.age) : "",
                });
              } catch (apiErr) {
                // Network error / offline fallback: load from cached session
                setUser(parsed);
                setFormData({
                  firstName: parsed.firstName || "",
                  lastName: parsed.lastName || "",
                  email: parsed.email || "",
                  password: "",
                  phone: parsed.phone || "",
                  age: parsed.age ? String(parsed.age) : "",
                });
              }
            }
          }
        } else {
          // Fallback to static mock details if no user has logged in
          const mockUser = {
            id: null,
            firstName: "Deepika",
            lastName: "",
            email: "deepikavaddi414@gmail.com",
            phone: "7569138706",
            age: 25,
          };
          setUser(mockUser);
          setFormData({
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            password: "",
            phone: mockUser.phone,
            age: String(mockUser.age),
          });
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setErrorMsg("Failed to retrieve profile details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch all customer subscriptions
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const res = await api.get("/api/subscriptions");
        if (res.data && res.data.success && res.data.data) {
          const pageData = res.data.data;
          if (Array.isArray(pageData.content)) {
            setCustomers(pageData.content);
            localStorage.setItem("customers_cache", JSON.stringify(pageData.content));
            return;
          }
        }
        throw new Error("No backend data");
      } catch (err) {
        console.warn("Backend down. Fetching customers from cache...");
        const cache = localStorage.getItem("customers_cache");
        if (cache) {
          setCustomers(JSON.parse(cache));
        } else {
          const defaultCustomers = [
            { id: 1, customerName: "Rahul Sharma", customerEmail: "rahul.sharma@gmail.com", subscriptionName: "Annual Basic", amount: 99.00, billingCycle: "ANNUAL", status: "ACTIVE", startDate: "2025-01-01", endDate: "2026-01-01" },
            { id: 2, customerName: "Neha Sharma", customerEmail: "neha.sharma@yahoo.com", subscriptionName: "Basic", amount: 9.99, billingCycle: "MONTHLY", status: "ACTIVE", startDate: "2025-01-10", endDate: "2025-02-10" },
            { id: 3, customerName: "Kiran Verma", customerEmail: "kiran.verma@outlook.com", subscriptionName: "Professional", amount: 29.99, billingCycle: "MONTHLY", status: "ACTIVE", startDate: "2025-01-12", endDate: "2025-02-12" },
            { id: 4, customerName: "Amit Patel", customerEmail: "amit.patel@gmail.com", subscriptionName: "Annual Pro", amount: 299.00, billingCycle: "ANNUAL", status: "ACTIVE", startDate: "2025-01-15", endDate: "2026-01-15" },
            { id: 5, customerName: "Siddharth Sen", customerEmail: "sid.sen@gmail.com", subscriptionName: "Enterprise", amount: 99.99, billingCycle: "MONTHLY", status: "ACTIVE", startDate: "2025-02-01", endDate: "2025-03-01" }
          ];
          setCustomers(defaultCustomers);
          localStorage.setItem("customers_cache", JSON.stringify(defaultCustomers));
        }
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  // Update user profile details
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!formData.firstName || !formData.phone || !formData.age || !formData.email) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    // Validate the email field properly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const isLocalUser = user && user.id && String(user.id).startsWith("local_");

    try {
      if (user && user.id && !isLocalUser) {
        const payload: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          phoneNumber: formData.phone,
          age: parseInt(formData.age),
          email: formData.email,
        };

        if (formData.password && formData.password.trim() !== "") {
          payload.password = formData.password.trim();
        }

        // Connect to update API endpoint on backend
        const response = await api.put(`/api/users/${user.id}`, payload);

        // Preserve JWT token in user object
        const updatedUser = {
          ...response.data,
          token: user.token
        };

        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setSuccessMsg("Profile details saved successfully!");
        setFormData(prev => ({ ...prev, password: "" }));
        setIsEditing(false);
      } else {
        // Offline / Local save fallback
        const updated = {
          ...user,
          id: user.id || "local_" + Date.now(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          phoneNumber: formData.phone,
          age: parseInt(formData.age),
        };
        setUser(updated);
        localStorage.setItem("currentUser", JSON.stringify(updated));

        // Update in registered local users array
        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const idx = localUsers.findIndex((u: any) => u.email === user.email);
        if (idx !== -1) {
          localUsers[idx] = updated;
        } else {
          localUsers.push(updated);
        }
        localStorage.setItem("localUsers", JSON.stringify(localUsers));

        setSuccessMsg("Profile details saved successfully (Offline Mode)!");
        setFormData(prev => ({ ...prev, password: "" }));
        setIsEditing(false);
      }
    } catch (err: any) {
      if (!err.response) {
        const updated = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          phoneNumber: formData.phone,
          age: parseInt(formData.age),
        };
        setUser(updated);
        localStorage.setItem("currentUser", JSON.stringify(updated));

        const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
        const idx = localUsers.findIndex((u: any) => u.email === user.email);
        if (idx !== -1) {
          localUsers[idx] = updated;
          localStorage.setItem("localUsers", JSON.stringify(localUsers));
        }
        setSuccessMsg("Profile details saved successfully (Offline Mode fallback)!");
        setFormData(prev => ({ ...prev, password: "" }));
        setIsEditing(false);
      } else {
        const errMsg = err.response?.data?.message || err.response?.data?.error || "Error occurred while saving profile.";
        setErrorMsg(errMsg);
      }
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        age: user.age ? String(user.age) : "",
      });
    }
    setIsEditing(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userDisplayName = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Deepika";
  const userAvatarInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : "D";

  // Filter customers by search term
  const filteredCustomers = customers.filter((c: any) => {
    const query = searchTerm.toLowerCase();
    return (
      (c.customerName || "").toLowerCase().includes(query) ||
      (c.customerEmail || "").toLowerCase().includes(query) ||
      (c.subscriptionName || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {subTab === "customers" ? "Customers" : "My Account"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-505 text-gray-500 mt-1">
            {subTab === "customers"
              ? "Manage and track all customer accounts and subscriptions."
              : "Manage your profile and subscription details."}
          </p>
        </div>

        {/* Sub-Tab Navigation Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/55">
          <button
            onClick={() => setSubTab("customers")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              subTab === "customers"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Customer Directory
          </button>
          <button
            onClick={() => setSubTab("profile")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              subTab === "profile"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium animate-fade-in">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium animate-fade-in">
          {errorMsg}
        </div>
      )}

      {subTab === "customers" ? (
        /* Customer Directory Tab View */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Directory</h2>
            </div>

            {/* Local Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or plan..."
                className="w-full pl-10 pr-4 py-3 text-xs outline-none bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-purple-100 transition-all text-gray-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            {loadingCustomers ? (
              <div className="text-center py-12 text-gray-400 font-medium">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Loading customer list...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium text-lg">
                No customers found
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 uppercase text-xs font-semibold">
                    <th className="pb-3 font-medium whitespace-nowrap text-slate-400">Customer Name</th>
                    <th className="pb-3 font-medium whitespace-nowrap text-slate-400">Email Address</th>
                    <th className="pb-3 font-medium whitespace-nowrap text-slate-400">Subscription Plan</th>
                    <th className="pb-3 font-medium whitespace-nowrap text-slate-400">Billing Cycle</th>
                    <th className="pb-3 font-medium whitespace-nowrap text-slate-400">Amount</th>
                    <th className="pb-3 font-medium whitespace-nowrap text-slate-400">Status</th>
                    <th className="pb-3 font-medium text-right whitespace-nowrap text-slate-400">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCustomers.map((c: any, index: number) => (
                    <tr key={c.id || index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-semibold text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                            {(c.customerName || "C").charAt(0).toUpperCase()}
                          </div>
                          {c.customerName}
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 whitespace-nowrap">{c.customerEmail}</td>
                      <td className="py-4 font-medium text-gray-700 whitespace-nowrap">
                        <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          {c.subscriptionName}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 whitespace-nowrap">
                        <span className="text-xs font-medium uppercase">{c.billingCycle}</span>
                      </td>
                      <td className="py-4 font-bold text-gray-800 whitespace-nowrap">
                        ${typeof c.amount === 'number' ? c.amount.toFixed(2) : parseFloat(c.amount || '0').toFixed(2)}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === "ACTIVE" 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-505 text-right whitespace-nowrap text-gray-500">{c.startDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* Profile Details Tab (existing UI) */
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm max-w-5xl space-y-8">
          {/* Header - Stacks on Mobile, Flex on Desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-5">
            <div className="flex items-center gap-3">
              <User className="text-pink-500 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Profile Details
              </h2>
            </div>

            {!isEditing && (
              <button 
                onClick={() => { setIsEditing(true); setSuccessMsg(""); setErrorMsg(""); }}
                className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all self-start sm:self-auto"
              >
                <Edit2 size={14} />
                Edit Info
              </button>
            )}
          </div>

          {/* User Info - Responsive Stacking on Mobile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md flex-shrink-0">
              {userAvatarInitial}
            </div>

            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                {userDisplayName}
              </h3>
              <p className="text-gray-550 text-xs sm:text-sm truncate text-gray-500">
                {user?.email || "deepikavaddi414@gmail.com"}
              </p>
            </div>
          </div>

          {/* Form Details Grid */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john.doe@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">New Password (optional)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Age"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Action Buttons - Stacks on Mobile, Flex on Desktop */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-md hover:shadow-pink-500/20 text-white font-bold text-sm px-6 py-2.5 sm:py-3 rounded-xl transition-all"
                >
                  <Save size={16} />
                  Save Changes
                </button>

                <button 
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm px-6 py-2.5 sm:py-3 rounded-xl transition-all"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Responsive Details Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <InfoItem
                icon={<User size={18} />}
                label="Full Name"
                value={userDisplayName}
              />

              <InfoItem
                icon={<Mail size={18} />}
                label="Email"
                value={user?.email || "deepikavaddi414@gmail.com"}
              />

              <InfoItem
                icon={<Phone size={18} />}
                label="Phone"
                value={user?.phone || "7569138706"}
              />

              <InfoItem
                icon={<Calendar size={18} />}
                label="Age"
                value={user?.age ? String(user.age) : "25"}
              />
            </div>
          )}

          {/* Subscription Info - Responsive layout padding and borders */}
          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-purple-500 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Current Subscription
              </h2>
            </div>

            {user?.activePlan ? (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.activePlan} Plan
                    </h3>
                    <p className="text-xs text-purple-600 font-semibold mt-0.5">
                      Active & Auto-renewing
                    </p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    setSuccessMsg("");
                    setErrorMsg("");
                    try {
                      if (user && user.activeSubscriptionId) {
                        await api.delete(`/api/subscriptions/${user.activeSubscriptionId}`);
                      }
                      const updated = { ...user };
                      delete updated.activePlan;
                      delete updated.activeSubscriptionId;
                      setUser(updated);
                      localStorage.setItem("currentUser", JSON.stringify(updated));
                      setSuccessMsg("Subscription cancelled successfully.");
                    } catch (err: any) {
                      // Offline fallback: clear locally
                      if (!err.response) {
                        const updated = { ...user };
                        delete updated.activePlan;
                        delete updated.activeSubscriptionId;
                        setUser(updated);
                        localStorage.setItem("currentUser", JSON.stringify(updated));
                        setSuccessMsg("Subscription cancelled successfully (Offline Mode).");
                      } else {
                        const errMsg = err.response?.data?.message || err.response?.data?.error || "Failed to cancel subscription.";
                        setErrorMsg(errMsg);
                      }
                    }
                  }}
                  className="border border-purple-200 hover:bg-purple-100/50 text-purple-700 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Cancel Subscription
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl py-8 px-4 sm:py-12 sm:px-6 flex flex-col items-center text-center">
                <Shield size={40} className="text-yellow-500 mb-4 animate-bounce" />

                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  No Active Subscription
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md">
                  Subscribe to a plan to unlock full capabilities and advanced analytics dashboard features.
                </p>

                <button 
                  onClick={() => setActiveTab && setActiveTab("plans")}
                  className="mt-6 w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-md hover:shadow-pink-500/20 text-white font-semibold px-8 py-3 rounded-xl transition-all"
                >
                  Choose a Plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccounts;