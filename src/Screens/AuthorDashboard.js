import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BookOpen, Users, TrendingUp } from 'lucide-react';
import statsService from '../services/statsServices';

const AuthorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const summaryStats = [
    {
      title: 'Total Books Published',
      value: stats.authorData.totalBooksByAuthor,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Sales',
      value: stats.authorData.totalSales,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-10 p-4 space-y-7">
      <h1 className="text-2xl font-bold text-gray-800">Author Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {summaryStats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Purchased Books */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Top Purchased Books</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.authorData.topPurchasedBooksByAuthor}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bookName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="purchaseCount" name="Purchase Count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Genres of Author's Books */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Top Genres of Your Books</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.authorData.topGenresByAuthor}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="genre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Books Count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
