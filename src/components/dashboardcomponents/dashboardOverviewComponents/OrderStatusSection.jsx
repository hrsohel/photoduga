import { Link } from "react-router-dom";
import { OrderStatusTable } from "./OrderStatusTable";

export function OrderStatusSection() {
  return (
    <div className="space-y-4 mt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
        <Link to="/dashboard/orders" className="text-sm text-[#558945]">
          View All Orders →
        </Link>
      </div>
      <OrderStatusTable />
    </div>
  );
}
