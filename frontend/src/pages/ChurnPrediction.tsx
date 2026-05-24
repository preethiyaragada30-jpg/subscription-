import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  Gift,
  Phone,
  Mail,
  Compass,
} from "lucide-react";
import api from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type SuggestionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
};

const SuggestionItem: React.FC<SuggestionProps> = ({
  icon,
  title,
  description,
  impact,
}) => {
  return (
    /* Stacks vertically on mobile, side-by-side on tablet/desktop */
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-gray-100 pb-5 last:border-b-0 last:pb-0 gap-3 animate-fade-in">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm max-w-md">{description}</p>
        </div>
      </div>

      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg self-start sm:self-auto flex-shrink-0">
        {impact}
      </span>
    </div>
  );
};

const ChurnPrediction: React.FC<{ searchQuery?: string }> = ({ searchQuery = "" }) => {
  const [chartData, setChartData] = useState<any[]>([
    { month: "Aug", value: 40 },
    { month: "Sep", value: 48 },
    { month: "Oct", value: 52 },
    { month: "Nov", value: 55 },
    { month: "Dec", value: 70 },
    { month: "Jan", value: 150 },
  ]);
  const [riskStats, setRiskStats] = useState({ high: 2, medium: 3, low: 4 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChurnData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/analytics/churn");
        if (res.data && res.data.success && res.data.data) {
          const data = res.data.data;
          if (Array.isArray(data.churnByRisk)) {
            const high = data.churnByRisk.find((r: any) => r.risk === "HIGH")?.count || 0;
            const medium = data.churnByRisk.find((r: any) => r.risk === "MEDIUM")?.count || 0;
            const low = data.churnByRisk.find((r: any) => r.risk === "LOW")?.count || 0;
            setRiskStats({ high, medium, low });
          }
          if (Array.isArray(data.monthlyGrowth) && data.monthlyGrowth.length > 0) {
            const mapped = data.monthlyGrowth.map((item: any) => ({
              month: item.month,
              value: Number(item.value) || 0
            }));
            setChartData(mapped);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch churn analytics, using cached mock data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChurnData();
  }, []);

  const suggestions = [
    {
      icon: <Gift className="text-pink-500" />,
      title: "Send discount offer",
      description: "Send a 20% discount coupon for the next 3 billing cycles.",
      impact: "High Impact"
    },
    {
      icon: <Phone className="text-pink-400" />,
      title: "Personal outreach call",
      description: "Schedule a call with an account manager to address issues.",
      impact: "High Impact"
    },
    {
      icon: <Compass className="text-purple-400" />,
      title: "Feature walkthrough",
      description: "Send a custom product walkthrough of features they haven’t used.",
      impact: "Medium Impact"
    },
    {
      icon: <Mail className="text-blue-400" />,
      title: "Email re-engagement",
      description: "Send a personalized email containing user metrics and value.",
      impact: "Medium Impact"
    }
  ];

  const filteredSuggestions = suggestions.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Churn Prediction</h1>
        <p className="text-gray-500 mt-1">
          AI-powered risk scoring to identify at-risk customers.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
          <AlertTriangle className="text-pink-500 mb-3" size={36} />
          <h2 className="text-4xl font-extrabold text-pink-500">{riskStats.high}</h2>
          <p className="text-gray-500 font-medium mt-1">High Risk Customers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
          <TrendingDown className="text-yellow-500 mb-3" size={36} />
          <h2 className="text-4xl font-extrabold text-yellow-500">{riskStats.medium}</h2>
          <p className="text-gray-500 font-medium mt-1">Medium Risk Customers</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
          <Shield className="text-green-500 mb-3" size={36} />
          <h2 className="text-4xl font-extrabold text-green-500">{riskStats.low}</h2>
          <p className="text-gray-500 font-medium mt-1">Low Risk Customers</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Churn Risk Trend
          </h2>

          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(236, 72, 153, 0.05)' }} 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                          {`Churn Risk: ${payload[0].value}`}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#ec4899" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Retention Playbook Suggestions
          </h2>

          <div className="space-y-6">
            {filteredSuggestions.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No suggestions found</p>
            ) : (
              filteredSuggestions.map((item, idx) => (
                <SuggestionItem
                  key={idx}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  impact={item.impact}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPrediction;