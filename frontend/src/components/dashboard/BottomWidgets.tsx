import { Users, DollarSign, ArrowRight } from "lucide-react";

const recentChurned = [
  { id: 1, company: "Nova Systems", date: "Jul 28, 2025", mrr: "$4,200", reason: "Payment" },
  { id: 2, company: "Bright Labs", date: "Jul 24, 2025", mrr: "$3,600", reason: "Usage" },
  { id: 3, company: "Pixel Perfect", date: "Jul 20, 2025", mrr: "$2,900", reason: "Price" },
];

const BottomWidgets = ({ setActiveTab, searchQuery = "" }: { setActiveTab?: (tab: string) => void; searchQuery?: string }) => {
  const filteredChurned = recentChurned.filter(account => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      account.company.toLowerCase().includes(query) ||
      account.reason.toLowerCase().includes(query) ||
      account.date.toLowerCase().includes(query)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Recent Churned */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Users className="text-purple-600" size={20} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Recent Churned</h2>
        </div>

        {/* Scrollable table container for small viewports */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase">
              <tr>
                <th className="pb-3 font-medium whitespace-nowrap">Customer</th>
                <th className="pb-3 font-medium whitespace-nowrap">Churn Date</th>
                <th className="pb-3 font-medium whitespace-nowrap">MRR</th>
                <th className="pb-3 font-medium whitespace-nowrap">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredChurned.map((account) => (
                <tr key={account.id}>
                  <td className="py-3 font-semibold text-gray-800 whitespace-nowrap">{account.company}</td>
                  <td className="py-3 text-gray-500 font-medium whitespace-nowrap">{account.date}</td>
                  <td className="py-3 font-semibold text-gray-800 whitespace-nowrap">{account.mrr}</td>
                  <td className="py-3 text-gray-500 font-medium whitespace-nowrap">{account.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={() => setActiveTab ? setActiveTab("prediction") : alert("Redirecting to churn risk prediction analysis...")}
            className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          >
            View all churned accounts
          </button>
        </div>
      </div>

      {/* Recovered Revenue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
           {/* Abstract background shape simulation */}
           <div className="w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-6 relative z-10">Recovered Revenue This Month</h2>
        
        <div className="flex items-end justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <DollarSign className="text-teal-600" size={24} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-teal-500 mb-1">$8,400</h3>
              <p className="text-sm text-gray-500 font-medium">from 11 accounts</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-end gap-1.5 h-12">
               <div className="w-3 h-4 bg-teal-200 rounded-t-sm"></div>
               <div className="w-3 h-6 bg-teal-300 rounded-t-sm"></div>
               <div className="w-3 h-9 bg-teal-400 rounded-t-sm"></div>
               <div className="w-3 h-12 bg-teal-500 rounded-t-sm relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 text-teal-600">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 relative z-10">
          <button 
            onClick={() => setActiveTab ? setActiveTab("payments") : alert("Redirecting to payment logs...")}
            className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
          >
            View save attempts <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomWidgets;
