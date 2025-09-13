// DashboardLayout.jsx
import DashboardHeader from "../components/dashboardcomponents/DashboardHeader";
import DashboardSidebar from "../components/dashboardcomponents/DashboardSidebar";
import { Outlet } from "react-router-dom"; // Import Outlet

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - শুধুমাত্র desktop এ দেখাবে */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - এতে MobileSidebar আছে mobile এর জন্য */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F4F8F2] p-4 sm:p-6 ">
          <Outlet /> {/* Replace {children} with Outlet */}
        </main>
      </div>
    </div>
  );
}
