import { useEffect, useState } from 'react';
import {
  Line, Bar, Pie, Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import {
  TrendingUp, TrendingDown, Package, ShoppingBag, Users, AlertCircle,
  DollarSign, CreditCard, Clock, CheckCircle, XCircle, Truck,
  BarChart3, PieChart as PieChartIcon, LineChart, Activity, UserPlus, Repeat,
  Zap, Target, Calendar, Award, Star, Wallet, Menu, X,
  LayoutDashboard, ShoppingCart, ChartBar, PieChart as PieChartIcon2,
  Users as UsersIcon, AlertTriangle, CreditCard as CreditCardIcon,
  Trophy, ChevronLeft, ChevronRight
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function VendorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const dashboardData = {
    monthlyRevenue: [
      { month: 'Jan', revenue: 120000 },
      { month: 'Feb', revenue: 145000 },
      { month: 'Mar', revenue: 132000 },
      { month: 'Apr', revenue: 180000 },
      { month: 'May', revenue: 210000 },
      { month: 'Jun', revenue: 240000 }
    ],
    ordersPerMonth: [
      { month: 'Jan', total: 45, delivered: 38, cancelled: 7 },
      { month: 'Feb', total: 52, delivered: 44, cancelled: 8 },
      { month: 'Mar', total: 48, delivered: 40, cancelled: 8 },
      { month: 'Apr', total: 65, delivered: 58, cancelled: 7 },
      { month: 'May', total: 78, delivered: 70, cancelled: 8 },
      { month: 'Jun', total: 85, delivered: 78, cancelled: 7 }
    ],
    categoryData: [
      { name: 'Electronics', sales: 345000, items: 245 },
      { name: 'Fashion', sales: 198000, items: 180 },
      { name: 'Groceries', sales: 145000, items: 320 },
      { name: 'Home & Living', sales: 98000, items: 95 },
      { name: 'Beauty', sales: 67000, items: 120 }
    ],
    userGrowthData: [
      { month: 'Jan', newUsers: 85, activeUsers: 320, returning: 180 },
      { month: 'Feb', newUsers: 92, activeUsers: 345, returning: 195 },
      { month: 'Mar', newUsers: 108, activeUsers: 380, returning: 215 },
      { month: 'Apr', newUsers: 125, activeUsers: 420, returning: 245 },
      { month: 'May', newUsers: 142, activeUsers: 460, returning: 275 },
      { month: 'Jun', newUsers: 158, activeUsers: 510, returning: 310 }
    ],
    orderStatusDistribution: [
      { status: 'Delivered', count: 328, percentage: 65, color: '#10b981' },
      { status: 'Pending', count: 95, percentage: 19, color: '#f59e0b' },
      { status: 'Shipped', count: 52, percentage: 10, color: '#3b82f6' },
      { status: 'Cancelled', count: 30, percentage: 6, color: '#ef4444' }
    ],
    lowStockItems: [
      { name: 'iPhone 15', stock: 3, threshold: 10, status: 'Critical' },
      { name: 'Wireless Earbuds', stock: 5, threshold: 10, status: 'Low' },
      { name: 'Smart Watch', stock: 2, threshold: 8, status: 'Critical' },
      { name: 'Laptop Bag', stock: 8, threshold: 15, status: 'Low' },
      { name: 'Phone Case', stock: 12, threshold: 20, status: 'Low' }
    ],
    paymentMethods: [
      { method: 'Cash on Delivery', count: 245, amount: 421500, percentage: 48 },
      { method: 'eSewa', count: 128, amount: 287600, percentage: 32 },
      { method: 'Khalti', count: 82, amount: 158900, percentage: 20 }
    ],
    topProducts: [
      { name: 'iPhone 15', sales: 120, revenue: 7200000 },
      { name: 'Nike Air Max', sales: 95, revenue: 1425000 },
      { name: 'Sony Headphones', sales: 88, revenue: 880000 },
      { name: 'Smart Watch', sales: 76, revenue: 608000 },
      { name: 'Laptop Bag', sales: 65, revenue: 325000 }
    ],
    topCustomers: [
      { name: 'John Doe', orders: 12, totalSpent: 45600 },
      { name: 'Sarah Smith', orders: 9, totalSpent: 38900 },
      { name: 'Mike Johnson', orders: 8, totalSpent: 34200 },
      { name: 'Emily Brown', orders: 7, totalSpent: 29800 },
      { name: 'David Wilson', orders: 6, totalSpent: 26700 }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calculate AOV
  const totalRevenue = dashboardData.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = dashboardData.ordersPerMonth.reduce((sum, item) => sum + item.total, 0);
  const aov = totalRevenue / totalOrders;

  // Line Chart Data for Monthly Revenue
  const revenueLineChartData = {
    labels: dashboardData.monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: dashboardData.monthlyRevenue.map(item => item.revenue),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Line Chart Data for User Growth
  const userGrowthLineChartData = {
    labels: dashboardData.userGrowthData.map(item => item.month),
    datasets: [
      {
        label: 'New Users',
        data: dashboardData.userGrowthData.map(item => item.newUsers),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(16, 185, 129)',
      },
      {
        label: 'Active Users',
        data: dashboardData.userGrowthData.map(item => item.activeUsers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Returning Users',
        data: dashboardData.userGrowthData.map(item => item.returning),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(139, 92, 246)',
      }
    ]
  };

  // Pie Chart Data for Category Sales
  const categoryPieChartData = {
    labels: dashboardData.categoryData.map(item => item.name),
    datasets: [
      {
        data: dashboardData.categoryData.map(item => item.sales),
        backgroundColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
        ],
        borderColor: 'white',
        borderWidth: 2,
      }
    ]
  };

  // Pie Chart Data for Order Status
  const orderStatusPieChartData = {
    labels: dashboardData.orderStatusDistribution.map(item => item.status),
    datasets: [
      {
        data: dashboardData.orderStatusDistribution.map(item => item.count),
        backgroundColor: dashboardData.orderStatusDistribution.map(item => item.color),
        borderColor: 'white',
        borderWidth: 2,
      }
    ]
  };

  // Bar Chart Data for Orders Per Month
  const ordersBarChartData = {
    labels: dashboardData.ordersPerMonth.map(item => item.month),
    datasets: [
      {
        label: 'Delivered',
        data: dashboardData.ordersPerMonth.map(item => item.delivered),
        backgroundColor: 'rgb(16, 185, 129)',
        borderRadius: 8,
      },
      {
        label: 'Cancelled',
        data: dashboardData.ordersPerMonth.map(item => item.cancelled),
        backgroundColor: 'rgb(239, 68, 68)',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        }
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            let value = context.raw;
            if (label) label += ': ';
            if (value.toString().includes('revenue')) {
              label += `₹${value.toLocaleString()}`;
            } else {
              label += value;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          callback: function(value) {
            if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
            return `₹${value}`;
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-zinc-900">{value}</p>
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

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'emerald' },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign, color: 'emerald' },
    { id: 'orders', label: 'Orders Analytics', icon: ShoppingBag, color: 'blue' },
    { id: 'products', label: 'Top Products', icon: Package, color: 'amber' },
    { id: 'categories', label: 'Category Sales', icon: PieChartIcon, color: 'purple' },
    { id: 'users', label: 'User Growth', icon: UsersIcon, color: 'orange' },
    { id: 'inventory', label: 'Stock Analytics', icon: AlertTriangle, color: 'red' },
    { id: 'payments', label: 'Payment Analytics', icon: CreditCardIcon, color: 'teal' },
    { id: 'customers', label: 'Top Customers', icon: Trophy, color: 'yellow' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-zinc-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Vendor Panel
              </h1>
              <p className="text-xs text-zinc-500 mt-1">Analytics Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-zinc-500" /> : <ChevronRight className="w-5 h-5 text-zinc-500" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const colorClasses = {
              emerald: 'text-emerald-600 bg-emerald-50',
              blue: 'text-blue-600 bg-blue-50',
              amber: 'text-amber-600 bg-amber-50',
              purple: 'text-purple-600 bg-purple-50',
              orange: 'text-orange-600 bg-orange-50',
              red: 'text-red-600 bg-red-50',
              teal: 'text-teal-600 bg-teal-50',
              yellow: 'text-yellow-600 bg-yellow-50'
            };
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeSection === item.id
                    ? `bg-gradient-to-r from-${item.color}-50 to-${item.color}-50/30 text-${item.color}-700 font-semibold`
                    : 'text-zinc-600 hover:bg-zinc-50'
                  }
                `}
              >
                <div className={`p-1.5 rounded-lg ${activeSection === item.id ? colorClasses[item.color] : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {sidebarOpen && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          {sidebarOpen && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Need Help?</p>
              <p className="text-xs text-zinc-600">Contact support for assistance</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="p-8">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-lg text-zinc-500">Welcome back! Here's your business at a glance.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Revenue"
                  value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
                  icon={DollarSign}
                  trend="up"
                  trendValue="+15.3% from last month"
                  color="bg-gradient-to-r from-emerald-500 to-teal-500"
                />
                <StatCard
                  title="Total Orders"
                  value={totalOrders}
                  icon={ShoppingBag}
                  trend="up"
                  trendValue="+12.5% from last month"
                  color="bg-gradient-to-r from-blue-500 to-cyan-500"
                />
                <StatCard
                  title="Average Order Value"
                  value={`₹${Math.round(aov).toLocaleString()}`}
                  icon={Target}
                  trend="up"
                  trendValue="+5.2% from last month"
                  color="bg-gradient-to-r from-purple-500 to-pink-500"
                />
                <StatCard
                  title="Active Customers"
                  value={dashboardData.userGrowthData[dashboardData.userGrowthData.length - 1].activeUsers}
                  icon={Users}
                  trend="up"
                  trendValue="+11.8% from last month"
                  color="bg-gradient-to-r from-orange-500 to-red-500"
                />
              </div>

              {/* Monthly Sales Line Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Monthly Sales Trend</h3>
                    <p className="text-sm text-zinc-500 mt-1">Revenue trend over the last 6 months</p>
                  </div>
                  <LineChart className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="h-96">
                  <Line data={revenueLineChartData} options={chartOptions} />
                </div>
              </div>
            </>
          )}

          {/* Revenue Analytics Section */}
          {activeSection === 'revenue' && (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Revenue Analytics</h1>
                <p className="text-zinc-500">Detailed revenue insights and trends</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">Monthly Revenue Trend</h3>
                <div className="h-96">
                  <Line data={revenueLineChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Orders Analytics Section */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Orders Analytics</h1>
                <p className="text-zinc-500">Track order volume and status distribution</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6">Orders Per Month</h3>
                  <div className="h-80">
                    <Bar data={ordersBarChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6">Order Status Distribution</h3>
                  <div className="h-80 flex items-center justify-center">
                    <Pie data={orderStatusPieChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Products Section */}
          {activeSection === 'products' && (
            <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
              <h1 className="text-3xl font-bold text-zinc-900 mb-6">Top Selling Products</h1>
              <div className="space-y-4">
                {dashboardData.topProducts.map((product, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{product.name}</span>
                      <span className="font-bold">{product.sales} sales</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-end px-2 text-xs font-bold text-white" style={{ width: `${(product.sales / 120) * 100}%` }}>
                        ₹{(product.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Sales Section */}
          {activeSection === 'categories' && (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Category Sales Performance</h1>
                <p className="text-zinc-500">Sales distribution across categories</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6">Sales by Category (Pie Chart)</h3>
                  <div className="h-96 flex items-center justify-center">
                    <Pie data={categoryPieChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
                  <h3 className="text-lg font-bold text-zinc-900 mb-6">Revenue Breakdown</h3>
                  <div className="space-y-4">
                    {dashboardData.categoryData.map((category, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{category.name}</span>
                          <span className="font-bold">₹{(category.sales / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-8 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end px-3 text-xs font-bold text-white" style={{ width: `${(category.sales / 345000) * 100}%` }}>
                            {category.items} items
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Growth Section */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">User Growth Analytics</h1>
                <p className="text-zinc-500">Track user acquisition and engagement</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">User Growth Trend</h3>
                <div className="h-96">
                  <Line data={userGrowthLineChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}

          {/* Stock Analytics Section */}
          {activeSection === 'inventory' && (
            <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
              <h1 className="text-3xl font-bold text-zinc-900 mb-6">Low Stock Alerts</h1>
              <div className="space-y-3">
                {dashboardData.lowStockItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div>
                      <p className="font-medium text-zinc-900">{item.name}</p>
                      <p className="text-xs text-zinc-500">Threshold: {item.threshold}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${item.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>Stock: {item.stock}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Critical' ? 'bg-red-200 text-red-700' : 'bg-orange-200 text-orange-700'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Analytics Section */}
          {activeSection === 'payments' && (
            <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
              <h1 className="text-3xl font-bold text-zinc-900 mb-6">Payment Method Analytics</h1>
              <div className="space-y-4">
                {dashboardData.paymentMethods.map((method, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{method.method}</span>
                      <span className="font-bold">{method.percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-6 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-between px-3 text-xs font-bold text-white" style={{ width: `${method.percentage}%` }}>
                        <span>₹{(method.amount / 1000).toFixed(0)}K</span>
                        <span>{method.count} txns</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Customers Section */}
          {activeSection === 'customers' && (
            <div className="bg-white rounded-2xl p-6 shadow border border-zinc-100">
              <h1 className="text-3xl font-bold text-zinc-900 mb-6">Top Customers</h1>
              <div className="space-y-3">
                {dashboardData.topCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors">
                    <div>
                      <p className="font-medium text-zinc-900">{customer.name}</p>
                      <p className="text-xs text-zinc-500">{customer.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">₹{customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}