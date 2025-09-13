import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Clock, Truck, X, DollarSign } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "8",
      icon: ShoppingCart,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Pending",
      value: "3",
      icon: Clock,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Shipped",
      value: "3",
      icon: Truck,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Cancelled",
      value: "3",
      icon: X,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      title: "Revenue",
      value: "$272.88",
      icon: DollarSign,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md"
          >
            <CardContent className="">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${stat.iconBg} bg-opacity-80 flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const OrderStats = () => {
  return (
    <div>
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
        <p className="text-gray-600 mb-6">
          Manage customer orders and track fulfillment status
        </p>
      </div>
      <StatsCards />
    </div>
  );
};

export default OrderStats;
