"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickStat {
  label: string;
  value: string | number;
  color: string;
}

interface QuickStatsProps {
  title: string;
  stats: QuickStat[];
}

export default function QuickStats({ title, stats }: QuickStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={`text-sm font-semibold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}