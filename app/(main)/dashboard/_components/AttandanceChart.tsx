"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AttendanceChartProps {
  data: Array<{
    date: string;
    santri: number;
    karyawan: number;
  }>;
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Kehadiran</CardTitle>
        <p className="text-sm text-gray-500">
          Data kehadiran santri dan karyawan 7 hari terakhir
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="santri"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Santri"
            />
            <Line
              type="monotone"
              dataKey="karyawan"
              stroke="#10b981"
              strokeWidth={2}
              name="Karyawan"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
