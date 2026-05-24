import { Mail, Tag, Phone, Percent, Eye } from "lucide-react";

const mockAccounts = [
  { id: 1, company: "Acme Co", domain: "acme.co", mrr: "$12,500", riskLevel: "High", riskScore: "72%", reason: "Payment failures, low usage", color: "text-purple-600 bg-purple-100" },
  { id: 2, company: "Beta LLC", domain: "beta.com", mrr: "$8,200", riskLevel: "High", riskScore: "64%", reason: "Decreasing usage", color: "text-purple-600 bg-purple-100" },
  { id: 3, company: "DesignCo", domain: "designco.io", mrr: "$6,900", riskLevel: "Medium", riskScore: "48%", reason: "Price sensitivity", color: "text-teal-600 bg-teal-100" },
];

const ActionButton = ({ icon: Icon, label, className, onClick }: { icon: any, label: string, className?: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors ${className}`}
  >
    <Icon size={14} className="text-gray-505" /> {label}
  </button>
);

const RiskTable = ({ setActiveTab, searchQuery = "" }: { setActiveTab?: (tab: string) => void; searchQuery?: string }) => {
  const filteredAccounts = mockAccounts.filter(account => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      account.company.toLowerCase().includes(query) ||
      account.domain.toLowerCase().includes(query) ||
      account.reason.toLowerCase().includes(query) ||
      account.riskLevel.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">High Risk Accounts - Needs Attention ({filteredAccounts.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
            <tr>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Customer</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">MRR</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Risk</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Reason</th>
              <th className="px-5 py-3 font-medium whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${account.color}`}>
                      {account.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{account.company}</p>
                      <p className="text-xs text-gray-400">{account.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{account.mrr}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      account.riskLevel === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {account.riskLevel}
                    </span>
                    <span className={account.riskLevel === 'High' ? 'text-red-500 font-semibold' : 'text-orange-500 font-semibold'}>
                      {account.riskScore}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 font-medium text-gray-600 whitespace-nowrap">{account.reason}</td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <ActionButton icon={Mail} label="Email" onClick={() => {
                      window.location.href = `mailto:support@${account.domain}?subject=RetainIQ%20Account%20Retention%20Outreach&body=Hello%20${encodeURIComponent(account.company)}%20team,`;
                    }} />
                    <ActionButton icon={Tag} label="Offer" className="hidden lg:flex" onClick={() => alert(`Successfully applied retention offer code to ${account.company}!`)} />
                    <ActionButton icon={Phone} label="Call" className="hidden xl:flex text-purple-600 border-purple-100 bg-purple-50/50 hover:bg-purple-100" onClick={() => {
                      window.location.href = `tel:+15550199`;
                    }} />
                    <ActionButton icon={Percent} label="Discount" className="text-purple-600 border-purple-100 bg-purple-50/50 hover:bg-purple-100" onClick={() => alert(`Successfully applied 20% discount code to ${account.company}!`)} />
                    <ActionButton icon={Eye} label="View" onClick={() => {
                      if (setActiveTab) {
                        setActiveTab("accounts");
                      } else {
                        alert(`Viewing user account details for ${account.company}...`);
                      }
                    }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
