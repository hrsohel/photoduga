import { Card, CardContent } from "@/components/ui/card";

const ProductCard = ({ name, category, quantity, price, image }) => {
  return (
    <div className="bg-white hover:shadow-lg transition-all duration-200 overflow-hidden rounded-md border border-gray-100">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative bg-gray-50 h-48 w-full overflow-hidden">
          <img
            src={image || "/api/placeholder/300/200"}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{category}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs text-gray-500">Sales</p>
              <p className="font-semibold text-gray-900">{quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="font-semibold text-gray-900">{price}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
export default ProductCard;
