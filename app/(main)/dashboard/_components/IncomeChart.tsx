"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IncomeChartProps {
  data: Array<{
    month: string;
    pemasukan: number;
    pengeluaran: number;
  }>;
}

export default function IncomeChart({ data }: IncomeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Keuangan</CardTitle>
        <p className="text-sm text-gray-500">
          Data pemasukan dan pengeluaran bulanan
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pemasukan" fill="#10b981" name="Pemasukan" />
            <Bar dataKey="pengeluaran" fill="#ef4444" name="Pengeluaran" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
