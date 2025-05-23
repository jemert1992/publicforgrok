
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Eye } from 'lucide-react';

export const RevenueDashboard = () => {
  const stats = {
    totalRevenue: 4850,
    monthlyGoal: 8000,
    ppvSales: 2340,
    tips: 1560,
    subscriptions: 950,
    activeClients: 47,
    ppvViews: 156
  };

  const recentSales = [
    { type: 'PPV', amount: 25, client: 'VIP_User_456', timestamp: '5 min ago' },
    { type: 'Tip', amount: 50, client: 'Client_123', timestamp: '12 min ago' },
    { type: 'PPV', amount: 15, client: 'Regular_789', timestamp: '23 min ago' },
    { type: 'Subscription', amount: 30, client: 'New_User_321', timestamp: '1 hour ago' },
  ];

  const progressPercentage = (stats.totalRevenue / stats.monthlyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.totalRevenue}</div>
            <p className="text-xs text-purple-300">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeClients}</div>
            <p className="text-xs text-purple-300">
              +5 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">PPV Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.ppvViews}</div>
            <p className="text-xs text-purple-300">
              85% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Monthly Goal</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{progressPercentage.toFixed(0)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Revenue Breakdown</CardTitle>
            <CardDescription className="text-purple-200">
              Current month performance by category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">PPV Sales</span>
                <span className="text-green-400 font-bold">${stats.ppvSales}</span>
              </div>
              <Progress value={(stats.ppvSales / stats.totalRevenue) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Tips</span>
                <span className="text-blue-400 font-bold">${stats.tips}</span>
              </div>
              <Progress value={(stats.tips / stats.totalRevenue) * 100} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Subscriptions</span>
                <span className="text-purple-400 font-bold">${stats.subscriptions}</span>
              </div>
              <Progress value={(stats.subscriptions / stats.totalRevenue) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Sales</CardTitle>
            <CardDescription className="text-purple-200">
              Latest transactions and client activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={sale.type === 'PPV' ? 'default' : sale.type === 'Tip' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {sale.type}
                    </Badge>
                    <div>
                      <p className="text-white font-medium">{sale.client}</p>
                      <p className="text-xs text-purple-300">{sale.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-bold">${sale.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
