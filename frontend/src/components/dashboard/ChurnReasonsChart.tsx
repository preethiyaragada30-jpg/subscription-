import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Payment", value: 42, color: "#9333ea" },
  { name: "Usage", value: 31, color: "#34d399" },
  { name: "Price", value: 18, color: "#fbbf24" },
  { name: "Other", value: 9, color: "#e5e7eb" },
];

const ChurnReasonsChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Churn Reasons</h2>

      {/* Responsive layout: stacks on mobile, horizontal row on larger viewports */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-full sm:w-1/2 h-48 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                dataKey="value" 
                innerRadius={60}
                outerRadius={80} 
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: 'transparent' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-800">100%</span>
            <span className="text-xs text-gray-500 font-medium">Total</span>
          </div>
        </div>

        <div className="w-full sm:w-1/2 pl-0 sm:pl-6">
          <ul className="space-y-4">
            {data.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChurnReasonsChart;
