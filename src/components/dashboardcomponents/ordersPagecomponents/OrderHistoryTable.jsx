import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const orders = [
    {
      id: 1,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Completed",
      paymentStatus: "Paid",
    },
    {
      id: 2,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "In Progress",
      paymentStatus: "Paid",
    },
    {
      id: 3,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Pending",
      paymentStatus: "Paid",
    },
    {
      id: 4,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Completed",
      paymentStatus: "Paid",
    },
    {
      id: 5,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Completed",
      paymentStatus: "In Progress",
    },
    {
      id: 6,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Pending",
      paymentStatus: "Pending",
    },
    {
      id: 7,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Cancelled",
      paymentStatus: "Refunded",
    },
    {
      id: 8,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "In Progress",
      paymentStatus: "Pending",
    },
    {
      id: 9,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "In Progress",
      paymentStatus: "Pending",
    },
    {
      id: 10,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "Cancelled",
      paymentStatus: "Refunded",
    },
    {
      id: 11,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "In Progress",
      paymentStatus: "Pending",
    },
    {
      id: 12,
      customer: "Emily Johnson",
      email: "emily.johnson@example.com",
      date: "2025-08-11",
      orders: "2 orders",
      amount: "$191",
      status: "In Progress",
      paymentStatus: "Pending",
    },
  ];

  // Filter orders by search and filterStatus
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all"
        ? true
        : order.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status) => {
    const statusStyles = {
      Completed: "bg-green-100 text-green-700 hover:bg-green-100",
      "In Progress": "bg-blue-100 text-blue-700 hover:bg-blue-100",
      Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      Cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
    };

    return (
      <Badge
        variant="secondary"
        className={`${statusStyles[status]} border-0 font-medium`}
      >
        {status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusStyles = {
      Paid: "bg-green-100 text-green-700 hover:bg-green-100",
      "In Progress": "bg-blue-100 text-blue-700 hover:bg-blue-100",
      Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      Refunded: "bg-red-100 text-red-700 hover:bg-red-100",
    };

    return (
      <Badge
        variant="secondary"
        className={`${statusStyles[status]} border-0 font-medium`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Search and Filter Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 border-gray-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48 border-gray-300">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order History
        </h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600 font-medium text-center">
                  Order ID
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Customer
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Date
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Orders
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Total Amount
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Status
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Payment Status
                </TableHead>
                <TableHead className="text-gray-600 font-medium text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <TableRow
                  key={index}
                  className="border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="font-medium text-gray-900 text-center">
                    {`#ORD-${order.id}`}
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.customer}
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 text-center">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-gray-700 text-center">
                    {order.orders}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-center">
                    {order.amount}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      to={`/dashboard/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        aria-label="View Order"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min(startIndex + 1, filteredOrders.length)} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0 bg-gradient-to-r from-[#10200B] to-[#2f4b26]"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
