// DashboardLayout.jsx
import DashboardHeader from "../components/dashboardcomponents/DashboardHeader";
import DashboardSidebar from "../components/dashboardcomponents/DashboardSidebar";
import { Outlet, useLocation } from "react-router-dom"; // Import Outlet

export default function DashboardLayout() {
  const { pathname } = useLocation()
  console.log(pathname !== "/dashboard/categories/calendars")
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - শুধুমাত্র desktop এ দেখাবে */}
      {
        pathname !== "/dashboard/categories/photo-album" ? <DashboardSidebar /> : <></>
      }

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - এতে MobileSidebar আছে mobile এর জন্য */}
        {
          pathname !== "/dashboard/categories/photo-album" || pathname !== "/dashboard/categories/calendars" ? <DashboardHeader /> : <></>
        }


        {/* Page Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-[#F4F8F2] ${
          pathname === "/dashboard/categories/photo-album" || pathname === "/dashboard/categories/calendars"
          ? "" : "p-4 sm:p-6"} `}>
          <Outlet /> {/* Replace {children} with Outlet */}
        </main>
      </div>
    </div>
  );
}
