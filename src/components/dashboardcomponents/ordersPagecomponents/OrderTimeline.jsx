export default function OrderTimeline() {
  const timelineItems = [
    {
      status: "Order Placed",
      date: "Nov 15, 2023 - 10:30 AM",
      color: "bg-green-500",
    },
    {
      status: "Payment Confirmed",
      date: "Nov 15, 2023 - 10:32 AM",
      color: "bg-green-500",
    },
    {
      status: "Processing",
      date: "Nov 15, 2023 - 10:33 AM",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="bg-white rounded-lg border p-6 w-full ">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Order Timeline
      </h2>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-300" />

        <div className="space-y-4">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 relative">
              <div
                className={`w-3 h-3 rounded-full ${item.color} mt-1 flex-shrink-0 relative z-10`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {item.status}
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
