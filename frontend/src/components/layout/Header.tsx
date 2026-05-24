import React from "react";
import { Search, Bell, Settings, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  setActiveTab?: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  setActiveTab,
  searchQuery = "",
  setSearchQuery
}) => {
  return (
    <header className="bg-white border-b border-gray-100 h-16 px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-purple-100 outline-none text-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xs font-semibold">⌘K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 ml-4">
        <div 
          onClick={() => setActiveTab ? setActiveTab("notifications") : console.log("Navigate to notifications")}
          className="relative cursor-pointer hover:opacity-85 transition-opacity"
          title="Notifications"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
            3
          </span>
        </div>
        
        <Settings 
          onClick={() => setActiveTab ? setActiveTab("settings") : console.log("Navigate to settings")}
          size={20} 
          className="text-gray-600 cursor-pointer hover:rotate-45 transition-transform duration-200" 
          title="Settings"
        />
      </div>
    </header>
  );
};

export default Header;
