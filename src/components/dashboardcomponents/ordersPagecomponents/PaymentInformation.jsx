import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentInformation() {
  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">Stripe</h3>
          <p className="text-sm text-green-600 font-medium">Status: Paid</p>
        </div>
        <div className="pt-2 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-900">$144.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="text-gray-900">$5.99</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total:</span>
            <span>$149.99</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
