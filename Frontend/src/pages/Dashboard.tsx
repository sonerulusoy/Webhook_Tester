import { Activity, Users, DollarSign } from 'lucide-react';
import Card from '../components/SharedComponents/Card';

export default function Dashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', trend: 'up' as const, icon: DollarSign },
    { label: 'Active Users', value: '2,350', change: '+180.1%', trend: 'up' as const, icon: Users },
    { label: 'Active Sessions', value: '12,234', change: '-19%', trend: 'down' as const, icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-textMuted">Welcome back, here is what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} {...stat} />
        ))}
      </div>

      {/* Recent Activity / Chart Area placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 min-h-[400px] flex flex-col">
          <h3 className="font-semibold mb-6">Revenue Overview</h3>
          <div className="flex-1 border-2 border-dashed border-surfaceBorder rounded-xl flex items-center justify-center text-textMuted">
            Chart Placeholder
          </div>
        </div>
        <div className="glass-panel p-6 min-h-[400px] flex flex-col">
          <h3 className="font-semibold mb-6">Recent Sales</h3>
          <div className="flex-1 border-2 border-dashed border-surfaceBorder rounded-xl flex items-center justify-center text-textMuted">
            Activity List
          </div>
        </div>
      </div>
    </div>
  );
}
