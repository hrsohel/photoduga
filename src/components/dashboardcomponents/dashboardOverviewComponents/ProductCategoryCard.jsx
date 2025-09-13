import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ProductCategoryCard = ({ name, totalsales, revenue, icon: Icon }) => {
  return (
    <Card className="bg-white rounded-md">
      <CardContent className="">
        <div className="flex items-center gap-4 mb-6 justify-between">
          <div className="p-3 rounded-lg bg-[#F4F8F2]">
            <Icon className={`h-5 w-5 text-green-900 `} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">{totalsales}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{revenue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategoryCard;
