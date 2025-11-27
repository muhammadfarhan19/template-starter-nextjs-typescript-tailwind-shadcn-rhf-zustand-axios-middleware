"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorClass = "bg-blue-500",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="flex-1 p-6">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">vs bulan lalu</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "h-full w-24 flex items-center justify-center",
              colorClass
            )}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
