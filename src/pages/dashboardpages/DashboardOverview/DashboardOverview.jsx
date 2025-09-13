import React from "react";
import DashboardOverviewHeading from "@/components/dashboardcomponents/dashboardOverviewComponents/DashboardOverviewHeading";
import MetricsSection from "@/components/dashboardcomponents/dashboardOverviewComponents/MetricsSection";
import { ProductCategoriesSection } from "@/components/dashboardcomponents/dashboardOverviewComponents/ProductCategoriesSection";
import { BestSellingProductsSection } from "@/components/dashboardcomponents/dashboardOverviewComponents/BestSellingProductsSection";
import { OrderStatusSection } from "@/components/dashboardcomponents/dashboardOverviewComponents/OrderStatusSection";

const DashboardOverview = () => {
  return (
    <div className="bg-[#F4F8F2]">
      <DashboardOverviewHeading />
      <MetricsSection />
      <ProductCategoriesSection />
      <BestSellingProductsSection />
      <OrderStatusSection />
    </div>
  );
};

export default DashboardOverview;
