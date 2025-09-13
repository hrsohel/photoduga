import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingInformation() {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">Standard Shipping</h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p>Tracking: TRK987654321O</p>
            <p>Est. Delivery: 2023-11-20</p>
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600">
            637 Washington Ave, Manchester, Kentucky 39495
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
