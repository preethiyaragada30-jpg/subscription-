import React from "react";
import { 
  Home, 
  Users, 
  CreditCard, 
  AlertCircle, 
  Activity, 
  BarChart2, 
  Bell, 
  Bookmark, 
  Puzzle, 
  Settings, 
  LogOut,
  X
} from "lucide-react";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  onClose 
}) => {
  
  const menuItems = [
    { label: "Dashboard", icon: Home, tabName: "overview" },
    { label: "User Accounts", icon: Users, tabName: "accounts" },
    { label: "Subscription Plans", icon: CreditCard, tabName: "plans" },
    { label: "Payment Module", icon: AlertCircle, tabName: "payments", badge: 3 },
    { label: "Churn Prediction", icon: Activity, tabName: "prediction" },
    { label: "Analytics Reports", icon: BarChart2, tabName: "analytics" },
    { label: "Notifications", icon: Bell, tabName: "notifications", badge: 5 },
    { label: "Saved Reports", icon: Bookmark, tabName: "saved" },
    { label: "Integrations", icon: Puzzle, tabName: "integrations" },
    { label: "Settings", icon: Settings, tabName: "settings" },
  ];

  const handleItemClick = (tabName: string) => {
    setActiveTab(tabName);
    onClose(); // Close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Vertical Sidebar */}
      <aside 
        className={`w-72 bg-[#161a29] text-white flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 shadow-2xl z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Activity size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              RetainIQ
            </span>
          </div>
          
          {/* Close button on mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
          {menuItems.map((item) => (
            <MenuItem
              key={item.tabName}
              label={item.label}
              icon={item.icon}
              tabName={item.tabName}
              activeTab={activeTab}
              onClick={handleItemClick}
              badge={item.badge}
            />
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-6 mt-auto border-t border-white/5">
          <Link 
            to="/login" 
            onClick={() => localStorage.removeItem("currentUser")}
            className="flex items-center gap-3 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 px-4 py-3 rounded-xl font-medium transition-all group duration-200"
          >
            <LogOut size={20} className="group-hover:text-rose-400 transition-colors" /> 
            <span className="text-sm">Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
