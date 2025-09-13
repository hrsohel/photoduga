import ProductCard from "./ProductCard";
import pic from "../../../assets/productImg.png";
import { Link } from "react-router-dom";

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

export function BestSellingProductsSection() {
  return (
    <div className="space-y-4 mt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Best Selling Products
        </h2>
        <Link
          to={"/dashboard/all-best-selling-products"}
          className="text-sm text-[#558945] "
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {productsData.slice(0, 5).map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            category={product.category}
            quantity={product.quantity}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
