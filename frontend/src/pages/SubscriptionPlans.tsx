import React, { useState } from "react";
import { CheckCircle, Crown } from "lucide-react";
import api from "../services/api";

const Feature = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center gap-3 text-gray-600">
      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

const SubscriptionPlans: React.FC<{ setActiveTab?: (tab: string) => void; searchQuery?: string }> = ({ setActiveTab, searchQuery = "" }) => {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubscribe = async (planTitle: string, priceStr: string) => {
    if (!currentUser || !currentUser.id) {
      showToast("Please register or login to view your account details and subscribe to a plan.", "error");
      return;
    }

    setLoadingPlan(planTitle);

    const price = parseFloat(priceStr.replace("$", ""));
    const today = new Date().toISOString().split("T")[0];
    
    // Set active plan end date (1 year if annual, 1 month if monthly)
    const isAnnual = planTitle.startsWith("Annual");
    const nextDate = new Date();
    if (isAnnual) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    const nextDateStr = nextDate.toISOString().split("T")[0];

    const payload = {
      subscriptionName: planTitle,
      customerName: `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || "Customer",
      customerEmail: currentUser.email,
      amount: price,
      billingCycle: isAnnual ? "ANNUAL" : "MONTHLY",
      startDate: today,
      endDate: nextDateStr,
      status: "ACTIVE",
      paymentMethod: "Credit Card",
      autoRenew: true,
      category: "SaaS"
    };

    try {
      // Connect to the Spring Boot REST API
      await api.post(`/api/subscriptions?userId=${currentUser.id}`, payload);
      
      // Fetch latest synced user profile from backend (includes activePlan and activeSubscriptionId)
      const userRes = await api.get(`/api/users/${currentUser.id}`);
      const updatedUser = {
        ...userRes.data,
        token: currentUser.token // Preserve JWT token
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      showToast(`Successfully subscribed to the ${planTitle} plan!`, "success");

      // Automatically navigate to checkout payment page for annual plans
      if (isAnnual && setActiveTab) {
        setTimeout(() => {
          setActiveTab("payments");
        }, 1500);
      }
    } catch (err: any) {
      console.warn("API subscription request failed, falling back to session storage...", err);
      // Offline fallback: save details locally if backend is offline
      if (!err.response) {
        const updatedUser = {
          ...currentUser,
          activePlan: planTitle
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        showToast(`Successfully subscribed to the ${planTitle} plan (Offline Mode)!`, "success");
        if (isAnnual && setActiveTab) {
          setTimeout(() => {
            setActiveTab("payments");
          }, 1500);
        }
      } else {
        const errMsg = err.response?.data?.message || err.response?.data?.error || "Subscription failed. Please check backend connection.";
        showToast(errMsg, "error");
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      title: "Basic",
      price: "$9.99",
      users: "5 Users",
      storage: "10 GB Storage",
      support: "Email Support",
      analytics: "Basic Analytics",
    },
    {
      title: "Professional",
      price: "$29.99",
      users: "25 Users",
      storage: "100 GB Storage",
      support: "Priority Support",
      analytics: "Advanced Analytics",
      api: "API Access",
      popular: true,
    },
    {
      title: "Enterprise",
      price: "$99.99",
      users: "Unlimited Users",
      storage: "1 TB Storage",
      support: "24/7 Support",
      analytics: "Full Analytics",
      api: "API Access",
      extra: "Custom Integrations",
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* In-page Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-rose-50 border-rose-100 text-rose-800"
        }`}>
          {toast.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Subscription Plans
        </h1>
        <p className="text-gray-500 mt-1">
          Choose the plan that fits your team.
        </p>
      </div>

      {/* Plans Grid - Responsive Grid Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans
          .filter(plan => 
            plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.users.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.storage.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((plan, index) => {
            const isCurrentPlan = currentUser?.activePlan === plan.title;

            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 relative flex flex-col justify-between hover:shadow-lg transition-all duration-200 border ${
                  plan.popular ? "border-purple-500 shadow-md ring-2 ring-purple-50" : "border-gray-100 shadow-sm"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm shadow-pink-500/20">
                    <Crown size={12} />
                    Most Popular
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.title}
                  </h2>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-800">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/month</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    <Feature text={plan.users} />
                    <Feature text={plan.storage} />
                    <Feature text={plan.support} />
                    <Feature text={plan.analytics} />

                    {plan.api && <Feature text={plan.api} />}
                    {plan.extra && <Feature text={plan.extra} />}
                  </div>
                </div>

                {/* Plan Button Actions */}
                <div className="flex items-center gap-4 mt-6 border-t border-gray-50 pt-6">
                  <button 
                    onClick={() => !isCurrentPlan && handleSubscribe(plan.title, plan.price)}
                    disabled={isCurrentPlan || loadingPlan !== null}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      isCurrentPlan
                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-md hover:shadow-pink-500/20 text-white hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    {loadingPlan === plan.title ? (
                      <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      "Subscribe"
                    )}
                  </button>

                  <button 
                    onClick={() => alert(`Initiating manual renewal sequence for ${plan.title} plan...`)}
                    className="text-gray-400 hover:text-gray-700 text-sm font-semibold transition-colors"
                  >
                    Renew
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Annual Plans */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6">Annual Billing Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { 
              title: "Annual Basic", 
              price: "$99", 
              savings: "Save ~17% vs monthly", 
              originalPrice: "$99",
              users: "5 Users",
              storage: "10 GB Storage",
              support: "Email Support",
              analytics: "Basic Analytics"
            },
            { 
              title: "Annual Pro", 
              price: "$299", 
              savings: "Save ~17% vs monthly", 
              originalPrice: "$299",
              users: "25 Users",
              storage: "100 GB Storage",
              support: "Priority Support",
              analytics: "Advanced Analytics",
              api: "API Access"
            }
          ]
            .filter(plan => 
              plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              plan.price.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((plan, idx) => {
              const isCurrentPlan = currentUser?.activePlan === plan.title;
              return (
                <div 
                  key={idx}
                  className={`bg-white rounded-3xl p-8 relative flex flex-col justify-between hover:shadow-lg transition-all duration-200 border ${
                    isCurrentPlan 
                      ? "border-blue-500 ring-2 ring-blue-50/50 border-2 shadow-md" 
                      : "border-gray-100 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-2xl font-bold text-gray-800">{plan.title}</h4>
                      <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100">
                        {plan.savings}
                      </span>
                    </div>
                    <div className="mb-6 flex items-baseline">
                      <span className="text-4xl font-extrabold text-gray-800">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/year</span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3.5 mb-8">
                      <Feature text={plan.users} />
                      <Feature text={plan.storage} />
                      <Feature text={plan.support} />
                      <Feature text={plan.analytics} />
                      {plan.api && <Feature text={plan.api} />}
                    </div>
                  </div>
                  
                  {/* Plan Button Actions */}
                  <div className="flex items-center gap-4 mt-6 border-t border-gray-50 pt-6">
                    <button
                      onClick={() => !isCurrentPlan && handleSubscribe(plan.title, plan.originalPrice)}
                      disabled={isCurrentPlan || loadingPlan !== null}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                        isCurrentPlan
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                          : "bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-md hover:shadow-pink-500/20 text-white hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {loadingPlan === plan.title ? (
                        <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : (
                        "Subscribe"
                      )}
                    </button>

                    <button 
                      onClick={() => alert(`Initiating manual renewal sequence for ${plan.title} plan...`)}
                      className="text-gray-400 hover:text-gray-700 text-sm font-semibold transition-colors"
                    >
                      Renew
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;