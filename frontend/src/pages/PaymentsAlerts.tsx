import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle2,
  Eye,
  Receipt,
  Plus,
  X,
  Search,
  Download,
} from "lucide-react";

interface Payment {
  id?: number;
  transactionId: string;
  userName: string;
  amount: number;
  method: string;
  date: string;
  status: string;
}

type StatProps = {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, sub, icon }: StatProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-gray-400 text-xs font-bold tracking-wide uppercase">
          {title}
        </p>
        <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
          {value}
        </h2>
        <p className="text-gray-500 text-xs mt-1.5">{sub}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
  );
};

const PaymentModule: React.FC<{ searchQuery?: string }> = ({ searchQuery = "" }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal States
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  // Form State
  const [payForm, setPayForm] = useState({
    userName: "",
    amount: "",
    method: "Credit/Debit Card",
  });

  // Fetch payments on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/payments");
      if (res.data && Array.isArray(res.data)) {
        setPayments(res.data);
        localStorage.setItem("payments_cache", JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn("Backend down. Fetching payments from localStorage...");
      const cache = localStorage.getItem("payments_cache");
      if (cache) {
        setPayments(JSON.parse(cache));
      } else {
        const defaults: Payment[] = [
          { transactionId: "TXN-001", userName: "Rahul Sharma", amount: 29.99, method: "Credit/Debit Card", date: "2025-01-01", status: "Completed" },
          { transactionId: "TXN-002", userName: "Neha Sharma", amount: 9.99, method: "PayPal", date: "2025-01-10", status: "Pending" },
          { transactionId: "TXN-003", userName: "Kiran Verma", amount: 19.99, method: "Credit/Debit Card", date: "2025-01-12", status: "Failed" },
          { transactionId: "TXN-004", userName: "Amit Patel", amount: 49.99, method: "UPI", date: "2025-01-15", status: "Completed" }
        ];
        setPayments(defaults);
        localStorage.setItem("payments_cache", JSON.stringify(defaults));
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Pay Now Modal Submit
  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payForm.userName.trim() || !payForm.amount || parseFloat(payForm.amount) <= 0) {
      showToast("Please fill in valid name and amount values.", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newPaymentData = {
      userName: payForm.userName,
      amount: parseFloat(payForm.amount),
      method: payForm.method,
      date: today,
      status: "Completed"
    };

    try {
      const res = await api.post("/api/payments", newPaymentData);
      if (res.data) {
        const updated = [res.data, ...payments];
        setPayments(updated);
        localStorage.setItem("payments_cache", JSON.stringify(updated));
        showToast(`Successfully processed payment of $${parseFloat(payForm.amount).toFixed(2)}!`, "success");
      }
    } catch (err) {
      console.warn("Backend down. Simulating payment locally...");
      const nextTxnId = `TXN-${String(payments.length + 1).padStart(3, "0")}`;
      const simulatedPayment: Payment = {
        transactionId: nextTxnId,
        userName: payForm.userName,
        amount: parseFloat(payForm.amount),
        method: payForm.method,
        date: today,
        status: "Completed"
      };
      const updated = [simulatedPayment, ...payments];
      setPayments(updated);
      localStorage.setItem("payments_cache", JSON.stringify(updated));
      showToast(`Successfully processed simulated payment of $${parseFloat(payForm.amount).toFixed(2)} (offline)!`, "success");
    }

    // Reset Form
    setPayForm({ userName: "", amount: "", method: "Credit/Debit Card" });
    setShowPayModal(false);
  };

  // Retry Failed Payment Action
  const handleRetryPayment = async (txnId: string) => {
    try {
      const res = await api.put(`/api/payments/${txnId}/status?status=Completed`);
      if (res.data) {
        const updated = payments.map(p => p.transactionId === txnId ? { ...p, status: "Completed" } : p);
        setPayments(updated);
        localStorage.setItem("payments_cache", JSON.stringify(updated));
        showToast(`Transaction ${txnId} re-processed successfully!`, "success");
      }
    } catch (err) {
      console.warn("Backend down. Simulating retry payment status update...");
      const updated = payments.map(p => p.transactionId === txnId ? { ...p, status: "Completed" } : p);
      setPayments(updated);
      localStorage.setItem("payments_cache", JSON.stringify(updated));
      showToast(`Transaction ${txnId} re-processed successfully (offline)!`, "success");
    }
  };

  // Download Receipt Simulation
  const handleDownloadReceipt = (payment: Payment) => {
    try {
      const receiptText = `==================================================
                 RETAINIQ RECEIPT                 
==================================================
Transaction ID: ${payment.transactionId}
Date:           ${payment.date}
Billed To:      ${payment.userName}
Payment Method: ${payment.method}
--------------------------------------------------
Subscription Service:        $${payment.amount.toFixed(2)}
Tax (0%):                     $0.00
--------------------------------------------------
Total Paid:                  $${payment.amount.toFixed(2)}
Status:                      ${payment.status.toUpperCase()}
==================================================
           Thank you for your business!           
==================================================`;

      const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Receipt_${payment.transactionId}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Receipt for ${payment.transactionId} downloaded successfully.`, "success");
    } catch (err) {
      showToast("Error downloading receipt.", "error");
    }
  };

  // Calculate stats dynamically
  const completedVolume = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const failedCount = payments.filter(p => p.status === "Failed").length;
  const pendingCount = payments.filter(p => p.status === "Pending").length;

  // Filter payments by search term
  const filteredPayments = payments.filter(p => 
    p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic alerts
  const failedAlertPayments = payments.filter(p => p.status === "Failed");
  const pendingAlertPayments = payments.filter(p => p.status === "Pending");

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-rose-50 border-rose-100 text-rose-800"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-rose-500" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Heading Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Payment Module
          </h1>
          <p className="text-gray-500 mt-1">
            Manage billing payments, invoices, and transaction logs.
          </p>
        </div>

        <button 
          onClick={() => setShowPayModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          Pay Now
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="TOTAL VOLUME COLLECTED"
          value={`$${completedVolume.toFixed(2)}`}
          sub="Updated in real-time"
          icon={<DollarSign className="text-emerald-500" size={24} />}
        />

        <StatCard
          title="FAILED TRANSACTIONS"
          value={String(failedCount)}
          sub="Awaiting retry actions"
          icon={<AlertCircle className="text-rose-500" size={24} />}
        />

        <div className="sm:col-span-2 lg:col-span-1">
          <StatCard
            title="PENDING APPROVALS"
            value={String(pendingCount)}
            sub="Awaiting manual review"
            icon={<Clock className="text-amber-500" size={24} />}
          />
        </div>
      </div>

      {/* Actionable Alerts */}
      {(failedAlertPayments.length > 0 || pendingAlertPayments.length > 0) && (
        <div className="space-y-4">
          {/* Failed Alerts */}
          {failedAlertPayments.map(p => (
            <div key={p.transactionId} className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-rose-500 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-rose-700">
                    Payment Failed — {p.userName}
                  </h3>
                  <p className="text-rose-600 text-sm mt-1">
                    Transaction {p.transactionId} for ${p.amount.toFixed(2)} failed via {p.method}.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleRetryPayment(p.transactionId)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm self-start sm:self-center"
              >
                Retry
              </button>
            </div>
          ))}

          {/* Pending Alerts */}
          {pendingAlertPayments.map(p => (
            <div key={p.transactionId} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <Clock className="text-amber-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-amber-700">
                    Payment Pending — {p.userName}
                  </h3>
                  <p className="text-amber-600 text-sm mt-1">
                    Transaction {p.transactionId} for ${p.amount.toFixed(2)} is awaiting completion.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedInvoice(p);
                  setShowInvoiceModal(true);
                }}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-bold transition self-start sm:self-center"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Transaction History Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Transaction History
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-3 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 text-xs outline-none bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-purple-100 transition-all text-gray-700"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              Loading payment transactions...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              No transactions match your search.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase text-xs font-semibold">
                  <th className="pb-3 font-medium whitespace-nowrap">Transaction ID</th>
                  <th className="pb-3 font-medium whitespace-nowrap">User</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Amount</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Method</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Date</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Status</th>
                  <th className="pb-3 font-medium text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map((p) => (
                  <tr key={p.transactionId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-semibold text-gray-800 whitespace-nowrap">{p.transactionId}</td>
                    <td className="py-4 text-gray-700 font-medium whitespace-nowrap">{p.userName}</td>
                    <td className="py-4 font-bold text-gray-800 whitespace-nowrap">${p.amount.toFixed(2)}</td>
                    <td className="py-4 text-gray-500 whitespace-nowrap">{p.method}</td>
                    <td className="py-4 text-gray-500 whitespace-nowrap">{p.date}</td>
                    <td className="py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.status === "Completed" 
                          ? "bg-emerald-50 text-emerald-700" 
                          : p.status === "Pending" 
                            ? "bg-amber-50 text-amber-700" 
                            : "bg-rose-50 text-rose-700"
                      }`}>
                        {p.status === "Completed" && <CheckCircle2 size={12} />}
                        {p.status === "Pending" && <Clock size={12} />}
                        {p.status === "Failed" && <AlertCircle size={12} />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button 
                          onClick={() => {
                            setSelectedInvoice(p);
                            setShowInvoiceModal(true);
                          }}
                          className="p-1 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" 
                          title="View Invoice"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDownloadReceipt(p)}
                          className="p-1 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition" 
                          title="Download Receipt"
                        >
                          <Receipt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* pay modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 relative animate-scale-up">
            <button 
              onClick={() => setShowPayModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Process New Payment</h3>
            <p className="text-gray-500 text-xs mb-6">Enter details to mock a completed subscription transaction.</p>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Customer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={payForm.userName}
                  onChange={(e) => setPayForm({ ...payForm, userName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="29.99"
                    value={payForm.amount}
                    onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Payment Method</label>
                  <select 
                    value={payForm.method}
                    onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition bg-white"
                  >
                    <option value="Credit/Debit Card">Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg shadow-indigo-500/10"
                >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* invoice modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-100 relative animate-scale-up">
            <button 
              onClick={() => {
                setShowInvoiceModal(false);
                setSelectedInvoice(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Invoice Design */}
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Invoice</h3>
                  <p className="text-xs text-gray-400 mt-1">Transaction: {selectedInvoice.transactionId}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedInvoice.status === "Completed" 
                      ? "bg-emerald-50 text-emerald-700" 
                      : selectedInvoice.status === "Pending" 
                        ? "bg-amber-50 text-amber-700" 
                        : "bg-rose-50 text-rose-700"
                  }`}>
                    {selectedInvoice.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider">Billed To</p>
                  <p className="font-semibold text-gray-800 mt-1 text-sm">{selectedInvoice.userName}</p>
                  <p className="text-gray-500 mt-0.5">RetainIQ Customer Account</p>
                </div>
                <div>
                  <p className="font-bold text-gray-400 uppercase tracking-wider text-right">Payment Method</p>
                  <p className="font-semibold text-gray-800 mt-1 text-sm text-right">{selectedInvoice.method}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 font-bold text-gray-600 border-b border-gray-100">
                      <th className="p-3.5">Item Description</th>
                      <th className="p-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3.5 text-gray-800 font-medium">RetainIQ Dashboard Subscription License</td>
                      <td className="p-3.5 text-right font-bold text-gray-800">${selectedInvoice.amount.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-gray-50">
                      <td className="p-3.5 text-right text-gray-400 font-medium">Tax (0%)</td>
                      <td className="p-3.5 text-right font-bold text-gray-800">$0.00</td>
                    </tr>
                    <tr className="border-t border-gray-100 bg-slate-50 font-bold text-gray-800">
                      <td className="p-3.5">Total Paid</td>
                      <td className="p-3.5 text-right text-purple-600 text-sm">${selectedInvoice.amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleDownloadReceipt(selectedInvoice)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-gray-700 hover:bg-slate-100 transition"
                >
                  <Download size={16} />
                  Download Receipt
                </button>
                <button 
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold text-center transition"
                >
                  Close Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModule;