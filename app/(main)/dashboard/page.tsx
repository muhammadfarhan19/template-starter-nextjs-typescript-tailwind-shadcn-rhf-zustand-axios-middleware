// app/dashboard/page.tsx
"use client";

import { Users, UserCheck, Wallet, TrendingUp } from "lucide-react";
import MainContainer from "@/components/layouts/MainContainer";
import StatCard from "./_components/StatCard";
import AttendanceChart from "./_components/AttandanceChart";
import IncomeChart from "./_components/IncomeChart";
import RecentActivity from "./_components/RecentActivity";
import QuickStats from "./_components/QuickStats";

// Sample data - nanti diganti dengan data dari API
const attendanceData = [
  { date: "Sen", santri: 145, karyawan: 18 },
  { date: "Sel", santri: 142, karyawan: 20 },
  { date: "Rab", santri: 148, karyawan: 19 },
  { date: "Kam", santri: 140, karyawan: 18 },
  { date: "Jum", santri: 150, karyawan: 20 },
  { date: "Sab", santri: 130, karyawan: 15 },
  { date: "Min", santri: 125, karyawan: 12 },
];

const incomeData = [
  { month: "Jan", pemasukan: 25000000, pengeluaran: 18000000 },
  { month: "Feb", pemasukan: 28000000, pengeluaran: 20000000 },
  { month: "Mar", pemasukan: 30000000, pengeluaran: 19000000 },
  { month: "Apr", pemasukan: 27000000, pengeluaran: 21000000 },
  { month: "Mei", pemasukan: 32000000, pengeluaran: 22000000 },
  { month: "Jun", pemasukan: 35000000, pengeluaran: 23000000 },
];

const recentActivities = [
  {
    id: "1",
    user: "Ahmad Zaki",
    action: "Menambahkan santri baru: Muhammad Ridwan",
    time: "5 menit yang lalu",
    type: "santri" as const,
  },
  {
    id: "2",
    user: "Siti Aminah",
    action: "Mencatat pembayaran SPP bulan Juni",
    time: "15 menit yang lalu",
    type: "keuangan" as const,
  },
  {
    id: "3",
    user: "Ustad Fajri",
    action: "Mengupdate data kehadiran kelas Tahfidz",
    time: "30 menit yang lalu",
    type: "santri" as const,
  },
  {
    id: "4",
    user: "Admin",
    action: "Menambahkan karyawan baru: Ustadzah Fatimah",
    time: "1 jam yang lalu",
    type: "karyawan" as const,
  },
  {
    id: "5",
    user: "Bendahara",
    action: "Membuat laporan keuangan bulanan",
    time: "2 jam yang lalu",
    type: "keuangan" as const,
  },
];

const santriStats = [
  { label: "Kelas Tahfidz", value: "85 santri", color: "text-blue-600" },
  { label: "Kelas Tajwid", value: "65 santri", color: "text-green-600" },
  { label: "Kelas Fiqih", value: "45 santri", color: "text-purple-600" },
];

const keuanganStats = [
  {
    label: "Pemasukan Bulan Ini",
    value: "Rp 35.000.000",
    color: "text-green-600",
  },
  {
    label: "Pengeluaran Bulan Ini",
    value: "Rp 23.000.000",
    color: "text-red-600",
  },
  { label: "Saldo", value: "Rp 12.000.000", color: "text-blue-600" },
];

export default function DashboardPage() {
  return (
    <MainContainer>
      {/* Header */}
      <div className="col-span-12 flex items-center justify-between mb-6">
        <div>
          <h1 className="font-semibold text-2xl">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Selamat datang di Sistem Manajemen Yayasan
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Santri"
          value="150"
          icon={Users}
          description="Santri aktif"
          trend={{ value: 5.2, isPositive: true }}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Total Karyawan"
          value="20"
          icon={UserCheck}
          description="Karyawan aktif"
          trend={{ value: 2.1, isPositive: true }}
          colorClass="bg-green-500"
        />
        <StatCard
          title="Keuangan"
          value="Rp 35jt"
          icon={Wallet}
          description="Pemasukan bulan ini"
          trend={{ value: 12.5, isPositive: true }}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value="95%"
          icon={TrendingUp}
          description="145 dari 150 santri"
          colorClass="bg-purple-500"
        />
      </div>

      {/* Charts Row */}
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AttendanceChart data={attendanceData} />
        <IncomeChart data={incomeData} />
      </div>

      {/* Bottom Row */}
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
        <div className="space-y-6">
          <QuickStats title="Statistik Santri" stats={santriStats} />
          <QuickStats title="Ringkasan Keuangan" stats={keuanganStats} />
        </div>
      </div>
    </MainContainer>
  );
}
