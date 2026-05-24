// SettingsPageWithLogoutModal.tsx

import React, { useState } from "react";
import {
  LayoutDashboard,
  User,
  CreditCard,
  DollarSign,
  TrendingDown,
  BarChart3,
  Bell,
  FileText,
  Puzzle,
  Settings,
  LogOut,
  Search,
  Sun,
  Globe,
  X,
} from "lucide-react";

const SettingsPageWithLogoutModal = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f8f8fc] relative overflow-hidden">
      {/* Overlay */}
      {showLogoutModal && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40" />
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-[#0f0b1f] text-white flex flex-col justify-between z-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-7">
            <div className="w-11 h-11 rounded-xl bg-pink-500 flex items-center justify-center">
              ⚡
            </div>

            <h1 className="text-3xl font-bold">SubManager</h1>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
            <MenuItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
            />

            <MenuItem icon={<User size={20} />} text="My Account" />

            <MenuItem
              icon={<CreditCard size={20} />}
              text="Subscription Plans"
            />

            <MenuItem
              icon={<DollarSign size={20} />}
              text="Payment Module"
            />

            <MenuItem
              icon={<TrendingDown size={20} />}
              text="Churn Prediction"
            />

            <MenuItem
              icon={<BarChart3 size={20} />}
              text="Analytics"
            />

            <MenuItem icon={<Bell size={20} />} text="Notifications" />

            <MenuItem icon={<FileText size={20} />} text="Reports" />

            <MenuItem icon={<Puzzle size={20} />} text="Integrations" />

            {/* Active */}
            <div className="bg-pink-500 rounded-xl">
              <MenuItem
                active
                icon={<Settings size={20} />}
                text="Settings"
              />
            </div>
          </nav>
        </div>

        {/* Logout */}
        <div className="p-5">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 bg-[#1a1630] hover:bg-[#241f40] transition-all px-5 py-3 rounded-xl"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 relative z-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-[320px] bg-white border border-gray-200 rounded-xl px-12 py-3 outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <Bell className="text-gray-500" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                D
              </div>

              <div>
                <h4 className="font-semibold text-sm">Deepika</h4>
                <p className="text-xs text-gray-400">View Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mt-12">
          <h1 className="text-5xl font-bold text-[#2b2440]">
            Settings
          </h1>

          <p className="text-gray-400 mt-2 text-lg">
            Manage your account preferences.
          </p>
        </div>

        {/* Settings Cards */}
        <div className="mt-12 space-y-10 max-w-4xl">
          {/* Theme */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Sun className="text-pink-500" size={22} />

              <h2 className="text-2xl font-semibold text-[#2b2440]">
                Theme Settings
              </h2>
            </div>

            <div className="border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <span className="text-gray-500">Default</span>

              <Sun className="text-gray-400" size={18} />
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-pink-500" size={22} />

              <h2 className="text-2xl font-semibold text-[#2b2440]">
                Language Preference
              </h2>
            </div>

            <select className="w-full border border-gray-200 rounded-xl px-5 py-4 outline-none text-gray-600">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Hindi</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Bell className="text-pink-500" size={22} />

              <h2 className="text-2xl font-semibold text-[#2b2440]">
                Notification Preferences
              </h2>
            </div>

            <div className="space-y-8">
              <ToggleItem label="Enable all push notifications" />
              <ToggleItem label="Receive email billing updates & reports" />
              <ToggleItem
                label="Receive SMS churn risk warnings"
                enabled={false}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <h2 className="text-3xl font-bold text-[#2b2440] mt-2">
              Confirm Logout
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              Are you sure you want to log out of SubManager?
            </p>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 transition-all py-3 rounded-xl font-medium"
              >
                Cancel
              </button>

              <button className="flex-1 bg-red-500 hover:bg-red-600 transition-all text-white py-3 rounded-xl font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type MenuItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
};

const MenuItem = ({ icon, text, active }: MenuItemProps) => {
  return (
    <button
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
        active
          ? "text-white"
          : "text-gray-300 hover:bg-[#1d1835] hover:text-white"
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
};

type ToggleItemProps = {
  label: string;
  enabled?: boolean;
};

const ToggleItem = ({
  label,
  enabled = true,
}: ToggleItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>

      <div
        className={`w-14 h-8 rounded-full relative transition-all ${
          enabled ? "bg-pink-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </div>
    </div>
  );
};

export default SettingsPageWithLogoutModal;