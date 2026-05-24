import React from "react";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  label: string;
  icon: LucideIcon;
  tabName: string;
  activeTab: string;
  onClick: (tab: string) => void;
  badge?: string | number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon: Icon,
  tabName,
  activeTab,
  onClick,
  badge,
}) => {
  const isActive = activeTab === tabName;

  return (
    <button
      onClick={() => onClick(tabName)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 outline-none ${
        isActive
          ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon
        size={20}
        className={`transition-colors duration-200 ${
          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
        }`}
      />
      <span className="flex-1 text-left text-sm">{label}</span>
      {badge !== undefined && (
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ml-auto shadow-sm ${
            isActive
              ? "bg-white text-rose-600"
              : "bg-rose-500 text-white shadow-rose-500/20"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export default MenuItem;
