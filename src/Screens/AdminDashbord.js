import React, { useEffect, useState } from 'react';
import statsService from '../services/statsServices';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BookOpen, Users, BookCopy } from 'lucide-react';

const Dashboard = () => {
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
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Authors',
      value: stats.totalAuthors,
      icon: BookCopy,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-10 p-4 space-y-7">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
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

      {/* Monthly Borrowing Trends - Top Purchased Books */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Top Purchased Books</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.adminData.topPurchasedBooks}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bookName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="purchaseCount" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Borrowing Trends - Top Genres by Book Count */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Top Genres by Book Count</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.adminData.topGenresByBookCount}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF5733" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Books and Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Books</h2>
          <div className="space-y-4">
            {stats.adminData.recentBooks.map((book) => (
              <div key={book._id} className="flex items-center gap-4">
                <img
                  src={"https://ktebbibackend.azurewebsites.net/"+book.imageUrl }
                  alt={book.name}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{book.name}</h3>
                  <p className="text-sm text-gray-500">
                    {book.author.firstname} {book.author.lastname}
                  </p>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize">
                    Published on {new Date(book.releaseDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {stats.adminData.recentUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-4">
                <img
                  src={"https://cdn-icons-png.flaticon.com/512/147/147131.png"}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
