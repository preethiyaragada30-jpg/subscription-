import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/Layout";

import Dashboard from "../pages/Dashboard";
import UserAccounts from "../pages/UserAccounts";
import SubscriptionPlans from "../pages/SubscriptionPlans";
import PaymentAlerts from "../pages/PaymentsAlerts";
import ChurnPrediction from "../pages/ChurnPrediction";
import AnalyticsReports from "../pages/AnalyticsReports";
import Notifications from "../pages/Notifications";
import SavedReports from "../pages/SavedReports";
import Integrations from "../pages/Integrations";
import Settings from "../pages/Settings";

const AppRoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserAccounts />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="payments" element={<PaymentAlerts />} />
          <Route path="churn" element={<ChurnPrediction />} />
          <Route path="analytics" element={<AnalyticsReports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="saved" element={<SavedReports />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutesComponent;
