import { DollarSign, AlertTriangle, TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react";

const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Revenue Health Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <DollarSign className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Revenue Health</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">$128.4k</h3>
            </div>
            <p className="text-xs text-green-500 font-medium flex items-center mt-1">
              <ArrowUpRight size={14} className="mr-0.5" /> 3.2% 
              <span className="text-gray-400 font-normal ml-1">vs last 30 days</span>
            </p>
          </div>
        </div>
        <div className="w-24 h-12 flex items-end">
          <svg viewBox="0 0 100 30" className="w-full h-full stroke-green-400 stroke-2 fill-none stroke-[3px]">
            <path d="M0 25 Q15 20 25 25 T50 15 T75 20 T100 5" />
          </svg>
        </div>
      </div>

      {/* Churn Risk Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Churn Risk</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">4.2%</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">predicted 30d</p>
          </div>
        </div>
        <div className="w-24 h-12 flex items-end">
          <svg viewBox="0 0 100 30" className="w-full h-full stroke-orange-300 stroke-2 fill-none stroke-[3px]">
            <path d="M0 25 L20 25 L35 15 L50 20 L75 5 L100 10" />
          </svg>
        </div>
      </div>

      {/* MRR Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
            <BarChart3 className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">MRR</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">$42.1k</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">Monthly Recurring Revenue</p>
          </div>
        </div>
        <div className="w-24 h-12 flex items-end">
          <svg viewBox="0 0 100 30" className="w-full h-full stroke-purple-400 stroke-2 fill-none stroke-[3px]">
            <path d="M0 30 L25 20 L50 25 L75 10 L100 0" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default KpiCards;
