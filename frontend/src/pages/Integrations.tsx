import React, { useState } from "react";
import { Puzzle, CheckCircle2, Eye, EyeOff, Save } from "lucide-react";

type IntegrationCardProps = {
  name: string;
  description: string;
  initialStatus: string;
  buttonText: string;
};

const IntegrationCard = ({
  name,
  description,
  initialStatus,
  buttonText,
}: IntegrationCardProps) => {
  const [status, setStatus] = useState(initialStatus);
  const [showKey, setShowKey] = useState(false);

  const toggleStatus = () => {
    const nextStatus = status === "active" ? "inactive" : "active";
    setStatus(nextStatus);
    alert(`${name} integration has been ${nextStatus === "active" ? "enabled" : "disabled"}!`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center flex-shrink-0">
              <Puzzle size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {name}
              </h3>

              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <CheckCircle2
              size={14}
              className={status === "active" ? "text-green-500" : "text-gray-400"}
            />

            <span
              className={`text-xs font-semibold uppercase ${
                status === "active" ? "text-green-600" : "text-gray-400"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* API Key Input */}
        <div className="mt-6">
          <label className="text-gray-400 text-xs font-bold uppercase">
            API Key
          </label>

          <div className="relative mt-1.5">
            <input
              type="text"
              value="api_key_secret_retainiq_1029384756"
              readOnly
              className="w-full border-none rounded-xl px-4 py-2.5 bg-slate-50 text-sm outline-none pr-11 font-mono text-gray-700"
              style={{ WebkitTextSecurity: showKey ? "none" : "disc" } as React.CSSProperties}
            />

            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6 border-t border-gray-50 pt-6">
        <button 
          onClick={() => alert(`${name} integration configuration details saved successfully!`)}
          className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-md hover:shadow-pink-500/20 transition-all text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs"
        >
          <Save size={14} />
          Save Config
        </button>

        <button 
          onClick={toggleStatus}
          className="flex-1 border border-gray-200 hover:bg-gray-50 transition-all py-2.5 rounded-xl text-gray-500 font-bold text-xs"
        >
          {status === "active" ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
};

const IntegrationsPage: React.FC = () => {
  const integrations = [
    {
      name: "Razorpay",
      description: "Payment gateway for Indian market integration",
      status: "active",
      button: "Disable",
    },
    {
      name: "Stripe",
      description: "Global payment processing and billing synchronization",
      status: "inactive",
      button: "Enable",
    },
    {
      name: "SendGrid",
      description: "Transactional email service and notification outreach",
      status: "active",
      button: "Disable",
    },
    {
      name: "Twilio",
      description: "SMS alerts, customer warning messages, and notifications",
      status: "inactive",
      button: "Enable",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Integrations
        </h1>

        <p className="text-gray-500 mt-1">
          Connect your payment, email, and SMS services.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((item, index) => (
          <IntegrationCard
            key={index}
            name={item.name}
            description={item.description}
            initialStatus={item.status}
            buttonText={item.button}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;