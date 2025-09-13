// OrderActions.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export function OrderActions({ hasSelection, onMarkCompleted, onCancel }) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-900">
          Order Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full bg-gradient-to-b from-[#10200B] to-[#2f4b26] text-white"
          size="sm"
          disabled={!hasSelection}
          onClick={onMarkCompleted}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Completed
        </Button>
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
          size="sm"
          disabled={!hasSelection}
          onClick={onCancel}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Order
        </Button>
      </CardContent>
    </Card>
  );
}
