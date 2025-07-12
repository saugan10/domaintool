import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatsCard from "@/components/stats-card";
import DomainCard from "@/components/domain-card";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Search, Bell, Globe, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { DashboardStats, DomainWithStats } from "@shared/schema";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: domains, isLoading: domainsLoading } = useQuery<DomainWithStats[]>({
    queryKey: ["/api/domains"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const recentDomains = domains?.slice(0, 6) || [];
  const unreadNotifications = Array.isArray(notifications) ? notifications.filter((n: any) => !n.read).length : 0;

  const statusChartData = {
    labels: ["Active", "Expiring Soon", "Expired"],
    datasets: [
      {
        data: [stats?.activeDomains || 0, stats?.expiringSoon || 0, stats?.expiredDomains || 0],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  const trendsChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Renewals",
        data: [3, 7, 4, 9, 6, 8],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (statsLoading || domainsLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 flex h-16 bg-white shadow border-b">
        <div className="flex-1 px-4 flex justify-between items-center">
          <div className="flex-1 flex">
            <div className="w-full flex md:ml-0">
              <div className="relative w-full text-gray-400 focus-within:text-gray-600 max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" />
                </div>
                <Input
                  className="block w-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                  placeholder="Search domains..."
                />
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your domain portfolio</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Domains"
              value={stats?.totalDomains || 0}
              icon={Globe}
              gradient="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Active"
              value={stats?.activeDomains || 0}
              icon={CheckCircle}
              gradient="from-green-500 to-green-600"
            />
            <StatsCard
              title="Expiring Soon"
              value={stats?.expiringSoon || 0}
              icon={AlertTriangle}
              gradient="from-yellow-500 to-yellow-600"
            />
            <StatsCard
              title="Expired"
              value={stats?.expiredDomains || 0}
              icon={XCircle}
              gradient="from-red-500 to-red-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Domain Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Pie
                    data={statusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Renewal Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <Line
                    data={trendsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Domains */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDomains.map((domain) => (
                  <DomainCard key={domain.id} domain={domain} />
                ))}
              </div>
              {domains && domains.length > 6 && (
                <div className="mt-6 text-center">
                  <Button>View All Domains</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
