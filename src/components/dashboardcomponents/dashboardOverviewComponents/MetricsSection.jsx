import React from "react";

import { Users, UserCheck, DollarSign, Tag } from "lucide-react";
import MetricCard from "./MetricCard";

export default function MetricsSection() {
  const metricsData = [
    {
      title: "Total Users",
      value: "1,248",
      subtitle: "+20.1% from last month",
      icon: Users,
    },
    {
      title: "Active Users",
      value: "64",
      subtitle: "+180.1% from last month",
      icon: UserCheck,
    },
    {
      title: "Total Revenue",
      value: "$1,459",
      subtitle: "+19% from last month",
      icon: DollarSign,
    },
    {
      title: "Active Discounts",
      value: "8",
      subtitle: "+201% from last month",
      icon: Tag,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          icon={metric.icon}
        />
      ))}
    </div>
  );
}
