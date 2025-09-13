import {
  Camera,
  Gift,
  ImageIcon,
  Palette,
  Calendar,
  Sticker,
} from "lucide-react";
import ProductCategoryCard from "./ProductCategoryCard";

const categoriesData = [
  {
    name: "Photo Album",
    totalsales: 248,
    revenue: "$12,450",
    icon: Camera,
  },
  {
    name: "Gifts",
    totalsales: 167,
    revenue: "$5,350",
    icon: Gift,
  },
  {
    name: "Photo Prints",
    totalsales: 156,
    revenue: "$6,240",
    icon: ImageIcon,
  },
  {
    name: "Canvas",
    totalsales: 312,
    revenue: "$7,800",
    icon: Palette,
  },
  {
    name: "Calendar",
    totalsales: 124,
    revenue: "$10,150",
    icon: Calendar,
  },
  {
    name: "Photo Sticker Album",
    totalsales: 89,
    revenue: "$8,200",
    icon: Sticker,
  },
];

export function ProductCategoriesSection() {
  return (
    <div className="space-y-4 mt-5">
      <h2 className="text-xl font-semibold text-gray-900">
        Product Categories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoriesData.map((category, index) => (
          <ProductCategoryCard
            key={index}
            name={category.name}
            totalsales={category.totalsales}
            revenue={category.revenue}
            s
            icon={category.icon}
          />
        ))}
      </div>
    </div>
  );
}
