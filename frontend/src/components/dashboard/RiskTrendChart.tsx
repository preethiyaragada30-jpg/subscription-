import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { date: 'May 4', value: 8 },
  { date: 'May 18', value: 9 },
  { date: 'Jun 1', value: 6.5 },
  { date: 'Jun 15', value: 5 },
  { date: 'Jun 29', value: 4.5 },
  { date: 'Jul 13', value: 3.5 },
  { date: 'Jul 27', value: 4.2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">
        {`${payload[0].value}%`}
      </div>
    );
  }
  return null;
};

const RiskTrendChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Churn Risk Trend</h2>
        <select className="border border-gray-200 text-sm text-gray-600 rounded-md px-3 py-1 outline-none">
          <option>Last 90 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#9333ea" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* End point badge simulation */}
        <div className="absolute right-0 top-[60%] -mt-3 transform translate-x-1">
           <div className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded">
             4.2%
           </div>
        </div>
      </div>
    </div>
  );
};

export default RiskTrendChart;
