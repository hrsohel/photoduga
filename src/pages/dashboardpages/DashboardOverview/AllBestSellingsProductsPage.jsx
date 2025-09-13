import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import pic from "../../../assets/productImg.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from "../../../components/dashboardcomponents/dashboardOverviewComponents/ProductCard";
import { Link } from "react-router-dom";

const categories = [
  "All",
  "Photo Album",
  "Gifts",
  "Canvas",
  "Photo Prints",
  "Calendar",
  "Sticker Album",
];
const productsData = [
  {
    id: 1,
    name: "Premium Photo Album",
    category: "Photo Album",
    quantity: 348,
    price: "$12,450",
    image: pic,
  },
  {
    id: 2,
    name: "Personalized Mug",
    category: "Gifts",
    quantity: 167,
    price: "$5,350",
    image: pic,
  },
  {
    id: 3,
    name: "Premium Photo Album",
    category: "Photo Album",
    quantity: 156,
    price: "$2,650",
    image: pic,
  },
  {
    id: 4,
    name: "Canvas Print 24x36",
    category: "Canvas",
    quantity: 142,
    price: "$7,500",
    image: pic,
  },
  {
    id: 5,
    name: "Premium Calendar",
    category: "Calendar",
    quantity: 248,
    price: "$12,450",
    image: pic,
  },
  {
    id: 6,
    name: "Sticker Album Collection",
    category: "Sticker Album",
    quantity: 89,
    price: "$3,200",
    image: pic,
  },
  {
    id: 7,
    name: "Photo Prints Set",
    category: "Photo Prints",
    quantity: 234,
    price: "$8,750",
    image: pic,
  },
  {
    id: 8,
    name: "Custom Canvas Art",
    category: "Canvas",
    quantity: 76,
    price: "$15,600",
    image: pic,
  },
  {
    id: 9,
    name: "Gift Bundle",
    category: "Gifts",
    quantity: 123,
    price: "$9,800",
    image: pic,
  },
  {
    id: 10,
    name: "Wall Calendar 2024",
    category: "Calendar",
    quantity: 198,
    price: "$4,500",
    image: pic,
  },
];

const products = productsData.map((product, index) => ({
  id: index + 1,
  ...product,
  quantity: product.quantity.toString(), // Convert number to string for ProductCard compatibility
}));

const AllBestSellingsProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          All Best Selling Products
        </h1>
        <p className="text-gray-600 mt-1">
          View and analyze your top performing products
        </p>
      </div>

      <div className="">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2  text-gray-900 font-semibold rounded-md transition"
            >
              <ChevronLeft size={20} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="bg-[#F4F8F2] hover:bg-[#F4F8F2] text-black"
                  asChild
                >
                  <Button variant="outline" size="sm">
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4 ml-2 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer ${
                        selectedCategory === category
                          ? "bg-green-100 text-black"
                          : ""
                      }`}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              category={product.category}
              quantity={product.quantity}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBestSellingsProductsPage;
