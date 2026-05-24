import React, { useState } from "react";
import { Sun, Globe, Bell } from "lucide-react";

type ToggleItemProps = {
  label: string;
  enabled: boolean;
  onToggle: () => void;
};

const ToggleItem = ({
  label,
  enabled,
  onToggle,
}: ToggleItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600 text-sm font-medium">{label}</span>

      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all relative outline-none ${
          enabled ? "bg-pink-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

const SettingsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = "" }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsWarnings, setSmsWarnings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    alert(`Successfully toggled to ${nextDark ? "Dark Theme" : "Light Theme"}!`);
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your account preferences.
        </p>
      </div>

      {/* Settings Content */}
      <div className="space-y-6 max-w-4xl">
        {/* Theme Settings */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Sun className="text-pink-500" size={20} />

            <h2 className="text-lg font-bold text-gray-800">
              Theme Settings
            </h2>
          </div>

          <div 
            onClick={toggleTheme}
            className="border border-gray-200 hover:bg-slate-50 cursor-pointer rounded-xl px-4 py-3 flex items-center justify-between text-sm transition-all"
            title="Click to toggle theme"
          >
            <span className="text-gray-500 font-semibold">{isDarkMode ? "Dark Theme" : "Light Theme"}</span>

            <Sun className={isDarkMode ? "text-pink-500" : "text-gray-400"} size={16} />
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-pink-500" size={20} />

            <h2 className="text-lg font-bold text-gray-800">
              Language Preference
            </h2>
          </div>

          <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none text-gray-600 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 transition-all">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Hindi</option>
            <option>French</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-pink-500" size={20} />

            <h2 className="text-lg font-bold text-gray-800">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-6">
            <ToggleItem
              label="Enable all push notifications"
              enabled={pushNotifications}
              onToggle={() =>
                setPushNotifications(!pushNotifications)
              }
            />

            <ToggleItem
              label="Receive email billing updates & reports"
              enabled={emailUpdates}
              onToggle={() => setEmailUpdates(!emailUpdates)}
            />

            <ToggleItem
              label="Receive SMS churn risk warnings"
              enabled={smsWarnings}
              onToggle={() => setSmsWarnings(!smsWarnings)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;