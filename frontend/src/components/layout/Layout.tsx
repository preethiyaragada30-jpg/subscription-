import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children?: ReactNode;
};

const Layout = ({ children }: Props) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-x-hidden">
        <Header onMenuClick={() => setIsOpen(true)} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;