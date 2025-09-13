import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Premium Photo Album",
    category: "photo-album",
    details: "Hard Cover, 22 x 22 cm, Wedding Day",
    price: "$89.99",
    qty: 1,
    image: "/premium-photo-album.png",
  },
  {
    id: 2,
    name: "My Pro Calendar",
    category: "photo-prints",
    details: "4 x 6 inch, Glossy",
    price: "$0.50",
    qty: 1,
    image: "/professional-calendar.png",
  },
  {
    id: 3,
    name: "Canvas Print",
    category: "canvas",
    details: "Single, 24 x 36 inch",
    price: "$50.00",
    qty: 1,
    image: "/canvas-art-print.png",
  },
  // baki gula same
];

export function OrderProductsList({ selectedIds, onToggleSelect }) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-start gap-4 p-4 bg-white rounded-lg"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(product.id)}
            onChange={() => onToggleSelect(product.id)}
            className="mt-2"
          />

          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-md object-cover flex-shrink-0 text-[#2f4b26]"
          />

          {/* Left Side Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-lg">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{product.category}</p>
            {product.details && (
              <p className="text-sm text-gray-500 mt-1">{product.details}</p>
            )}
          </div>

          {/* Right Side Info + View Details */}
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-gray-900 text-lg">
              {product.price}
            </p>
            <p className="text-sm text-gray-600">Qty: {product.qty}</p>

            {/* ✅ Updated Link */}
            <Link
              to={`/dashboard/orders/${product.category}/${product.id}`}
              className="text-sm text-[#2f4b26] hover:underline mt-2 inline-block"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
