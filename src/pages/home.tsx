
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, BarChart3, Settings, Plus, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Hero Section */}
      <div className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-indigo-100 border-b">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to DomainPro
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your comprehensive domain management solution. Monitor, manage, and maintain your domain portfolio with ease.
            </p>
            <Link href="/add-domain">
              <Button size="lg" className="text-lg px-8 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Domain
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Domains Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href="/domains">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">My Domains</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      View and manage your domain portfolio. Monitor expiry dates, renewal status, and domain health.
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-green-50">
                      Manage Domains
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              {/* Dashboard Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href="/dashboard">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      Get insights into your domain portfolio with analytics, charts, and important notifications.
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-blue-50">
                      View Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              {/* Settings Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href="/settings">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      Configure your account preferences, notification settings, and security options.
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-purple-50">
                      Manage Settings
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Choose DomainPro?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Domain Tracking</h3>
                <p className="text-sm text-gray-600">
                  Monitor all your domains in one place with real-time status updates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">
                  Get insights with detailed charts and portfolio statistics.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Auto-Renewal</h3>
                <p className="text-sm text-gray-600">
                  Never miss a renewal with automated reminders and notifications.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Management</h3>
                <p className="text-sm text-gray-600">
                  Simple interface to add, update, and organize your domains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
