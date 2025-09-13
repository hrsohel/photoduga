// OrderConfirmationPage.jsx
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderProductsList } from "@/components/dashboardcomponents/ordersPagecomponents/OrderProductsList";
import OrderTimeline from "@/components/dashboardcomponents/ordersPagecomponents/OrderTimeline";
import { useState } from "react";
import { OrderActions } from "@/components/dashboardcomponents/ordersPagecomponents/OrderActions";
import { Link } from "react-router-dom";
import PaymentInformation from "@/components/dashboardcomponents/ordersPagecomponents/PaymentInformation";
import ShippingInformation from "@/components/dashboardcomponents/ordersPagecomponents/ShippingInformation";

export default function OrderConfirmationPage() {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleMarkCompleted = () => {
    alert(`Completed products: ${selectedIds.join(", ")}`);
    setSelectedIds([]); // reset
  };

  const handleCancel = () => {
    alert(`Cancelled products: ${selectedIds.join(", ")}`);
    setSelectedIds([]); // reset
  };

  return (
    <div className="rounded-lg p-2 ">
      <Link to="/dashboard/orders" className="mb-6">
        <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <OrderProductsList
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderActions
            hasSelection={selectedIds.length > 0}
            onMarkCompleted={handleMarkCompleted}
            onCancel={handleCancel}
          />
          <OrderTimeline />
          <PaymentInformation />
          <ShippingInformation />
        </div>
      </div>
    </div>
  );
}
