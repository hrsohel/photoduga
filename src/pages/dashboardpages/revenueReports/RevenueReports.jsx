import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// Sample data
const monthlyData = [
  { month: "Jan", sales: 2500 },
  { month: "Feb", sales: 1800 },
  { month: "Mar", sales: 9800 },
  { month: "Apr", sales: 3800 },
  { month: "May", sales: 4600 },
  { month: "Jun", sales: 3600 },
];

const categoryData = [
  { name: "Photo Albums", value: 30, color: "#f59e0b" },
  { name: "Canvas Prints", value: 25, color: "#065f46" },
  { name: "Sticker Album", value: 15, color: "#f9a8d4" },
  { name: "Gifts", value: 15, color: "#dc2626" },
  { name: "Photo Prints", value: 10, color: "#fb7185" },
  { name: "Calendars", value: 5, color: "#c084fc" },
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  value,
}) => {
  if (!cx || !cy || !name || !value) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="500"
    >
      {`${name} ${value}%`}
    </text>
  );
};

const RevenueReports = () => {
  const [dateRange, setDateRange] = useState("Last Week");
  const [totalRevenue, setTotalRevenue] = useState(263000);
  const [totalOrders, setTotalOrders] = useState(300);

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    switch (value) {
      case "Last Week":
        setTotalRevenue(15000);
        setTotalOrders(50);
        break;
      case "Last 2 Months":
        setTotalRevenue(45000);
        setTotalOrders(120);
        break;
      case "Last 1 Year":
        setTotalRevenue(263000);
        setTotalOrders(300);
        break;
      default:
        setTotalRevenue(263000);
        setTotalOrders(300);
        break;
    }
  };

  const getFilteredData = () => {
    switch (dateRange) {
      case "Last Week":
        return monthlyData.slice(-1);
      case "Last 2 Months":
        return monthlyData.slice(-2);
      case "Last 1 Year":
        return monthlyData;
      default:
        return monthlyData;
    }
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Revenue Reports
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            View your Revenue reports
          </p>
        </div>
        <div>
          <Select onValueChange={handleDateRangeChange} value={dateRange}>
            <SelectTrigger className="border rounded px-2 py-2 bg-white">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last Week">Last Week</SelectItem>
              <SelectItem value="Last 2 Months">Last 2 Months</SelectItem>
              <SelectItem value="Last 1 Year">Last 1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">24.7%</span>
                  <span className="text-gray-500 ml-1">
                    from previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalOrders}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600 font-medium">36.5%</span>
                  <span className="text-gray-500 ml-1">
                    from previous period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Sales & Product Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Total Package Sales Month-Wise
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getFilteredData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10200B" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#558945"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#52604D" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#558945" }}
                      domain={[0, 10000]}
                      ticks={[0, 2500, 5000, 7500, 10000]}
                    />
                    <Bar
                      dataKey="sales"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                      fill="url(#grad1)" // Gradient applied here
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Revenue by Product Category
              </h3>
              <div className="h-80 w-full flex flex-col items-center">
                <div className="w-full h-64 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={1}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
                  {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-600">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueReports;
