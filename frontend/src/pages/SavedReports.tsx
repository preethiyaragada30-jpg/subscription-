import React, { useState } from "react";
import { FileText, Download, Plus, Search } from "lucide-react";

type ReportItemProps = {
  title: string;
  date: string;
  size: string;
  tag: string;
  tagColor: string;
};

const ReportItem = ({
  title,
  date,
  size,
  tag,
  tagColor,
}: ReportItemProps) => {
  const handleDownload = () => {
    try {
      const reportText = `==================================================
                 RETAINIQ REPORT                 
==================================================
Report Title: ${title}
Date:         ${date}
File Size:    ${size}
Tag:          ${tag}
--------------------------------------------------
This is a dynamically generated mock report for "${title}".
All system analytics and retention indexes are fully compiled.
==================================================`;
      const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title.replace(/\s+/g, "_")}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report", err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-all gap-4">
      {/* Left */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 flex-shrink-0">
          <FileText size={18} />
        </div>

        <div>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">
            {title}
          </h3>

          <p className="text-gray-400 text-xs mt-1">
            {date} · Size: {size}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColor}`}
        >
          {tag}
        </span>

        <button 
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-pink-600 transition-colors"
        >
          <Download size={16} />
          Download
        </button>
      </div>
    </div>
  );
};

const ReportsPage: React.FC<{ searchQuery?: string }> = ({ searchQuery = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);
  const [reports, setReports] = useState([
    {
      title: "January 2025 Revenue Report",
      date: "2025-01-19",
      size: "2.4 MB",
      tag: "Revenue Report",
      tagColor: "bg-cyan-50 text-cyan-600 border border-cyan-100",
    },
    {
      title: "Q4 2024 Churn Analysis",
      date: "2025-01-10",
      size: "1.8 MB",
      tag: "Churn Analysis",
      tagColor: "bg-pink-50 text-pink-600 border border-pink-100",
    },
    {
      title: "User Growth December 2024",
      date: "2025-01-05",
      size: "1.2 MB",
      tag: "User Growth Metrics",
      tagColor: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      title: "Active Subscriptions Jan 2025",
      date: "2025-01-19",
      size: "0.9 MB",
      tag: "subscription",
      tagColor: "bg-gray-50 text-gray-600 border border-gray-100",
    },
  ]);

  const handleGenerateReport = () => {
    const reportDate = new Date();
    const dateStr = reportDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const count = reports.length + 1;
    const reportName = `Custom Retention Analysis ${dateStr} #${count}`;
    
    const newReport = {
      title: reportName,
      date: reportDate.toISOString().split('T')[0],
      size: "1.5 MB",
      tag: "Custom Report",
      tagColor: "bg-purple-50 text-purple-600 border border-purple-100",
    };
    
    setReports([newReport, ...reports]);
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Saved Reports
          </h1>

          <p className="text-gray-500 mt-1">
            View and download generated reports.
          </p>
        </div>

        <button 
          onClick={handleGenerateReport}
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-md hover:shadow-pink-500/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={16} />
          Generate Report
        </button>
      </div>

      {/* Search Reports */}
      <div className="relative w-full sm:w-[350px]">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />

        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-xl px-11 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-100 transition-all"
        />
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredReports.map((report, index) => (
          <ReportItem
            key={index}
            title={report.title}
            date={report.date}
            size={report.size}
            tag={report.tag}
            tagColor={report.tagColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;