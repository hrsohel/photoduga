import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const ordersData = [
  {
    orderId: "ORD-1001",
    customer: "(555) 555-0107",
    product: "Canvas",
    amount: "$191",
    status: "Completed",
    date: "2023-06-11",
  },
  {
    orderId: "ORD-1002",
    customer: "(555) 333-0108",
    product: "Photo Album",
    amount: "$191",
    status: "In Progress",
    date: "2023-06-11",
  },
  {
    orderId: "ORD-1003",
    customer: "(555) 555-0109",
    product: "Canvas",
    amount: "$191",
    status: "Pending",
    date: "2023-06-11",
  },
  {
    orderId: "ORD-1004",
    customer: "(555) 345-0110",
    product: "Sticker Album",
    amount: "$191",
    status: "Completed",
    date: "2023-06-11",
  },
  {
    orderId: "ORD-1005",
    customer: "(555) 333-0111",
    product: "Gift",
    amount: "$191",
    status: "In Progress",
    date: "2023-06-11",
  },
  {
    orderId: "ORD-1006",
    customer: "(555) 555-0112",
    product: "Canvas",
    amount: "$191",
    status: "Pending",
    date: "2023-06-11",
  },
  {
    orderId: "ORD-1007",
    customer: "(555) 555-0113",
    product: "Sticker Album",
    amount: "$191",
    status: "In Progress",
    date: "2023-06-11",
  },
];

function getStatusBadge(status) {
  switch (status) {
    case "Completed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Completed
        </Badge>
      );
    case "In Progress":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Progress
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function OrderStatusTable() {
  return (
    <Card className="bg-white rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-medium">Order ID</TableHead>
            <TableHead className="text-center font-medium">Customer</TableHead>
            <TableHead className="text-center font-medium">Product</TableHead>
            <TableHead className="text-center font-medium">Amount</TableHead>
            <TableHead className="text-center font-medium">Status</TableHead>
            <TableHead className="text-center font-medium">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData.map((order, index) => (
            <TableRow key={index}>
              <TableCell className="text-center font-medium">
                {order.orderId}
              </TableCell>
              <TableCell className="text-center">{order.customer}</TableCell>
              <TableCell className="text-center">{order.product}</TableCell>
              <TableCell className="text-center font-medium">
                {order.amount}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(order.status)}
              </TableCell>
              <TableCell className="text-center">{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
