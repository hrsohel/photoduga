import OrderHistoryTable from "@/components/dashboardcomponents/ordersPagecomponents/OrderHistoryTable";
import OrderStats from "@/components/dashboardcomponents/ordersPagecomponents/OrderStats";
import React from "react";

const AllOrder = () => {
  return (
    <div>
      <OrderStats />
      <OrderHistoryTable />
    </div>
  );
};

export default AllOrder;
