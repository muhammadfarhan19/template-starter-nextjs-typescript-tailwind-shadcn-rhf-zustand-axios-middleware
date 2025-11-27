"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "santri" | "karyawan" | "keuangan" | "other";
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityTypeColors = {
  santri: "bg-blue-100 text-blue-800",
  karyawan: "bg-green-100 text-green-800",
  keuangan: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <p className="text-sm text-gray-500">Aktivitas terbaru dalam sistem</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">
                  {activity.user.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      activityTypeColors[activity.type]
                    )}
                  >
                    {activity.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{activity.action}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
