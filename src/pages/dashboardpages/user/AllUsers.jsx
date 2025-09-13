import { useState } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const userData = [
  {
    id: 1,
    name: "Jane Cooper",
    email: "jane@email.com",
    phone: "(205) 555-0100",
    customerId: "CST-1234",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
    city: "Manchester",
    state: "Kentucky",
    zipCode: "39495",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "Completed",
    date: "2025-08-11",
    avatar: "/jane-cooper-profile.png",
  },
  {
    id: 2,
    name: "Guy Hawkins",
    email: "guy@email.com",
    phone: "(205) 555-0101",
    customerId: "CST-1235",
    address: "2715 Ash Dr. San Jose, South Dakota 83475",
    city: "San Jose",
    state: "South Dakota",
    zipCode: "83475",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "Pending",
    date: "2025-08-11",
    avatar: "/guy-hawkins-profile.png",
  },
  {
    id: 3,
    name: "Jerome Bell",
    email: "jerome@email.com",
    phone: "(205) 555-0102",
    customerId: "CST-1236",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    city: "Santa Ana",
    state: "Illinois",
    zipCode: "85486",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "Pending",
    date: "2025-08-11",
    avatar: "/jerome-bell-profile.png",
  },
  {
    id: 4,
    name: "Jenny Wilson",
    email: "jenny@email.com",
    phone: "(205) 555-0103",
    customerId: "CST-1237",
    address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    city: "Shiloh",
    state: "Hawaii",
    zipCode: "81063",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "Completed",
    date: "2025-08-11",
    avatar: "/jenny-wilson-profile.png",
  },
  {
    id: 5,
    name: "Darlene Robertson",
    email: "darlene@email.com",
    phone: "(205) 555-0104",
    customerId: "CST-1238",
    address: "3517 W. Gray St. Utica, Pennsylvania 57867",
    city: "Utica",
    state: "Pennsylvania",
    zipCode: "57867",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "Completed",
    date: "2025-08-11",
    avatar: "/darlene-robertson-profile.png",
  },
  {
    id: 6,
    name: "Theresa Webb",
    email: "theresa@email.com",
    phone: "(205) 555-0105",
    customerId: "CST-1239",
    address: "2464 Royal Ln. Mesa, New Jersey 45463",
    city: "Mesa",
    state: "New Jersey",
    zipCode: "45463",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "Pending",
    date: "2025-08-11",
    avatar: "/theresa-webb-profile.png",
  },
  {
    id: 7,
    name: "Kristin Watson",
    email: "kristin@email.com",
    phone: "(205) 555-0106",
    customerId: "CST-1240",
    address: "3891 Ranchview Dr. Richardson, California 62639",
    city: "Richardson",
    state: "California",
    zipCode: "62639",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/kristin-watson-profile.png",
  },
  {
    id: 8,
    name: "Ralph Edwards",
    email: "ralph@email.com",
    phone: "(205) 555-0107",
    customerId: "CST-1241",
    address: "6391 Elgin St. Celina, Delaware 10299",
    city: "Celina",
    state: "Delaware",
    zipCode: "10299",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/ralph-edwards-profile.png",
  },
  {
    id: 9,
    name: "Ronald Richards",
    email: "ronald@email.com",
    phone: "(205) 555-0108",
    customerId: "CST-1242",
    address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
    city: "Syracuse",
    state: "Connecticut",
    zipCode: "35624",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/ronald-richards-profile.png",
  },
  {
    id: 10,
    name: "Dianne Russell",
    email: "dianne@email.com",
    phone: "(205) 555-0109",
    customerId: "CST-1243",
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    city: "Allentown",
    state: "New Mexico",
    zipCode: "31134",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/dianne-russell-profile.png",
  },
  {
    id: 11,
    name: "Leslie Alexander",
    email: "leslie@email.com",
    phone: "(205) 555-0110",
    customerId: "CST-1244",
    address: "1109 Vesta Drive, Oklahoma City, Oklahoma 73108",
    city: "Oklahoma City",
    state: "Oklahoma",
    zipCode: "73108",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/leslie-alexander-profile.png",
  },
  {
    id: 12,
    name: "Robert Fox",
    email: "robert@email.com",
    phone: "(205) 555-0111",
    customerId: "CST-1245",
    address: "8502 Preston Rd. Inglewood, Maine 98380",
    city: "Inglewood",
    state: "Maine",
    zipCode: "98380",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/robert-fox-profile.png",
  },
  {
    id: 13,
    name: "Brooklyn Simmons",
    email: "brooklyn@email.com",
    phone: "(205) 555-0112",
    customerId: "CST-1246",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
    city: "Manchester",
    state: "Kentucky",
    zipCode: "39495",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/brooklyn-simmons-profile.png",
  },
  {
    id: 14,
    name: "Bessie Cooper",
    email: "bessie@email.com",
    phone: "(205) 555-0113",
    customerId: "CST-1247",
    address: "3605 Parker Rd. Allentown, New Mexico 31134",
    city: "Allentown",
    state: "New Mexico",
    zipCode: "31134",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/bessie-cooper-profile.png",
  },
  {
    id: 15,
    name: "Devon Lane",
    email: "devon@email.com",
    phone: "(205) 555-0114",
    customerId: "CST-1248",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    city: "Santa Ana",
    state: "Illinois",
    zipCode: "85486",
    country: "USA",
    orders: 2,
    totalSpent: "$191",
    status: "In Progress",
    date: "2025-08-11",
    avatar: "/devon-lane-profile.png",
  },
];

export function AllUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 11;
  const filteredUsers = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status}
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className=" ">
      {/* Main Content */}
      <div className="">
        <Card className="">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Users</CardTitle>
                <p>View and manage your customers</p>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table className="bg-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">User</TableHead>
                  <TableHead className="text-center">Email</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-center">Total Spent</TableHead>
                  <TableHead className="text-center">Order Status</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-start">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{user.orders} orders</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.totalSpent}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-center">
                      {user.date}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min(startIndex + 1, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
                {searchQuery && ` (filtered from ${userData.length} total)`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
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
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              User Details
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Profile Section */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">
                    Customer ID: {selectedUser.customerId}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    <p className="text-sm">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Customer ID
                    </label>
                    <p className="text-sm">{selectedUser.customerId}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="text-md font-semibold mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Address
                    </label>
                    <p className="text-sm">{selectedUser.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      City
                    </label>
                    <p className="text-sm">{selectedUser.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      State / Province
                    </label>
                    <p className="text-sm">{selectedUser.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      ZIP / Postal Code
                    </label>
                    <p className="text-sm">{selectedUser.zipCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Country
                    </label>
                    <p className="text-sm">{selectedUser.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h4 className="text-md font-semibold mb-3">
                  Order Information
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Total Orders
                    </label>
                    <p className="text-sm">{selectedUser.orders} orders</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Total Spent
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedUser.totalSpent}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Order Date
                    </label>
                    <p className="text-sm">{selectedUser.date}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
