import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  useEffect(() => {
    // Fetch actual data from your API
    setStats({
      totalRevenue: 1250000,
      totalOrders: 342,
      totalUsers: 1280,
      totalProducts: 156
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
            icon={DollarSign}
            trend="up"
            trendValue="+12.5% from last month"
            color="bg-gradient-to-r from-emerald-500 to-teal-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            trend="up"
            trendValue="+8.2% from last month"
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend="up"
            trendValue="+15.3% from last month"
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend="up"
            trendValue="+5.7% from last month"
            color="bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                    <p className="text-xs text-gray-500">Customer Name</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">₹{(Math.random() * 5000).toFixed(0)}</p>
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {[
                { name: 'iPhone 15', sales: 45, revenue: 6750000 },
                { name: 'Nike Shoes', sales: 38, revenue: 1140000 },
                { name: 'Sony Headphones', sales: 32, revenue: 640000 }
              ].map((product, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{product.name}</span>
                    <span className="font-bold text-gray-900">{product.sales} sales</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end px-2 text-xs font-bold text-white"
                      style={{ width: `${(product.sales / 45) * 100}%` }}
                    >
                      ₹{(product.revenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}