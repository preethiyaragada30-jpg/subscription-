import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../services/api";
import KpiCards from "../components/dashboard/KpiCards";
import RiskTable from "../components/dashboard/RiskTable";
import RiskTrendChart from "../components/dashboard/RiskTrendChart";
import ChurnReasonsChart from "../components/dashboard/ChurnReasonsChart";
import BottomWidgets from "../components/dashboard/BottomWidgets";

// Dynamic Page Components imports
import UserAccounts from "./UserAccounts";
import SubscriptionPlans from "./SubscriptionPlans";
import PaymentsAlerts from "./PaymentsAlerts";
import ChurnPrediction from "./ChurnPrediction";
import AnalyticsReports from "./AnalyticsReports";
import Notifications from "./Notifications";
import SavedReports from "./SavedReports";
import Integrations from "./Integrations";
import Settings from "./Settings";

// --- OVERVIEW CONTENT (MAIN DASHBOARD) ---
const OverviewContent = ({ stats, setActiveTab, searchQuery }: { stats?: any; setActiveTab: (tab: string) => void; searchQuery: string }) => (
  <div className="space-y-6">
    <KpiCards stats={stats} />
    <RiskTable setActiveTab={setActiveTab} searchQuery={searchQuery} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RiskTrendChart />
      <ChurnReasonsChart />
    </div>
    <BottomWidgets setActiveTab={setActiveTab} searchQuery={searchQuery} />
  </div>
);

// --- MAIN DASHBOARD INTERFACE ---
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  
  // React state synchronized with URL query params
  const [activeTab, setActiveTabState] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/dashboard/stats");
        if (res.data && res.data.success && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch dashboard stats from backend:", err);
      }
    };
    fetchStats();
  }, [activeTab]);

  // Keep state synchronized if URL updates (e.g. browser back/forward buttons)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'overview';
    if (tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [searchParams]);

  const setActiveTab = (tabName: string) => {
    setActiveTabState(tabName);
    setSearchParams({ tab: tabName });
    setSearchQuery(""); // Clear search query on tab navigation
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent stats={stats} setActiveTab={setActiveTab} searchQuery={searchQuery} />;
      case "accounts":
        return <UserAccounts setActiveTab={setActiveTab} searchQuery={searchQuery} />;
      case "plans":
        return <SubscriptionPlans setActiveTab={setActiveTab} searchQuery={searchQuery} />;
      case "payments":
        return <PaymentsAlerts searchQuery={searchQuery} />;
      case "prediction":
        return <ChurnPrediction searchQuery={searchQuery} />;
      case "analytics":
        return <AnalyticsReports />;
      case "notifications":
        return <Notifications searchQuery={searchQuery} />;
      case "saved":
        return <SavedReports searchQuery={searchQuery} />;
      case "integrations":
        return <Integrations />;
      case "settings":
        return <Settings searchQuery={searchQuery} />;
      default:
        return <OverviewContent stats={stats} setActiveTab={setActiveTab} searchQuery={searchQuery} />;
    }
  };

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      <div key={activeTab} className="animate-fade-in">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;