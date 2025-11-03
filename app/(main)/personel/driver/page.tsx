// ========================================
// app/dashboard/page.tsx - Example Dashboard Page
// ========================================
export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to OILS Patra Logistik Management System
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kendaraan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">150</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dokumen Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Personel Aktif</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">35</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 py-3 border-b">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span>📝</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New report submitted</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-3 border-b">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span>🔧</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Maintenance scheduled</p>
                <p className="text-sm text-gray-600">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span>✅</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Document approved</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  