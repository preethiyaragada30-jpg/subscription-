import React, { useState, useEffect } from "react";
import { Check, AlertTriangle, Wallet, Bell, TrendingDown, UserPlus } from "lucide-react";
import api from "../services/api";

type NotificationProps = {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  onMarkRead: (id: number) => void;
};

const NotificationItem = ({
  id,
  title,
  description,
  time,
  icon,
  onMarkRead,
}: NotificationProps) => {
  return (
    /* Stacks vertically on mobile, side-by-side on tablet/desktop */
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-4 sm:px-6 py-5 border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
              {title}
            </h3>

            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0"></span>
          </div>

          <p className="text-gray-500 text-sm mt-1">{description}</p>

          <span className="text-xs text-gray-400 mt-1 inline-block">
            {time}
          </span>
        </div>
      </div>

      <button 
        onClick={() => onMarkRead(id)}
        className="text-pink-600 hover:text-pink-700 text-xs font-bold transition self-start sm:self-auto pl-14 sm:pl-0"
      >
        Mark read
      </button>
    </div>
  );
};

const NotificationsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = "" }) => {
  const [currentUser] = useState<any>(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setLoading(false);
      return;
    }
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/notifications/user/${currentUser.id}`);
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const unread = res.data.data.filter((n: any) => !n.isRead).map((n: any) => {
            let iconType = <Bell size={18} />;
            if (n.notificationType === "PAYMENT") iconType = <Wallet size={18} />;
            else if (n.notificationType === "CHURN") iconType = <TrendingDown size={18} />;
            else if (n.notificationType === "RENEWAL") iconType = <Bell size={18} />;
            
            return {
              id: n.id,
              title: n.title,
              description: n.message,
              time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
              icon: iconType
            };
          });
          setList(unread);
        }
      } catch (err) {
        console.warn("Backend down. Using mock notifications.");
        setList([
          { id: 1, title: "Payment Successful", description: "Your Professional plan payment of $29.99 was successful.", time: "2h ago", icon: <Wallet size={18} /> },
          { id: 2, title: "Renewal Reminder", description: "Your Basic plan expires in 5 days. Please renew.", time: "4h ago", icon: <Bell size={18} /> },
          { id: 3, title: "High Churn Risk", description: "Kiran Verma is at high churn risk. Take action now.", time: "6h ago", icon: <TrendingDown size={18} /> },
          { id: 4, title: "Payment Failed", description: "Payment of $9.99 failed for Kiran Verma.", time: "1d ago", icon: <AlertTriangle size={18} /> },
          { id: 5, title: "New User Registered", description: "Neha Sharma signed up for the Basic plan.", time: "2d ago", icon: <UserPlus size={18} /> }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleMarkRead = async (id: number) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.warn("Failed to mark as read on backend, marking locally.");
      setList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(list.map(item => api.patch(`/api/notifications/${item.id}/read`).catch(() => {})));
      setList([]);
    } catch (err) {
      setList([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Notifications
          </h1>

          <p className="text-gray-500 mt-1">
            {list.length} unread notification{list.length !== 1 ? "s" : ""}
          </p>
        </div>

        {list.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <Check size={16} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {list.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">
            No unread notifications left.
          </div>
        ) : (
          list
            .filter(item => 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <NotificationItem
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                time={item.time}
                icon={item.icon}
                onMarkRead={handleMarkRead}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;