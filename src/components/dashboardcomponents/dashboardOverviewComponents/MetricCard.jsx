import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  // Split first word for highlight
  const [highlightText, ...restText] = subtitle.split(" ");

  return (
    <Card className="bg-white rounded-md relative overflow-hidden shadow-sm">
      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#10200B] to-[#2f4b26]" />

      <CardContent className="relative">
        {/* Top section: title, value and icon */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>

          <div
            className={cn(
              "p-3 rounded-full",
              iconBg || "bg-gradient-to-b from-[#10200B] to-[#2f4b26]",
              iconColor || "text-white"
            )}
          >
            {Icon && <Icon className="h-6 w-6" />}
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-3">
          <p className="text-xs mt-1">
            <span className="text-[#16A34A] font-medium">{highlightText}</span>{" "}
            <span className="text-gray-500">{restText.join(" ")}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
