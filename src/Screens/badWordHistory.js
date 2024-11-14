import React, { useEffect, useState } from 'react';
import { BookOpen, User, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom'; // Assuming you're using react-router for route params
import userService from '../services/userservices';

// Custom Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

// Custom Badge Component
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-600',
    outline: 'bg-red-50 text-red-600 border border-red-200'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const BadWordsHistory = () => {
  const { id } = useParams(); // Get the user ID from the route params
  const [userData, setUserData] = useState(null);
  const [commentHistory, setCommentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const data = await userService.getHistory(id);
      setUserData({
        name: `${data.user.firstname} ${data.user.lastname}`,
        totalComments: data.totalComments,
        totalFlagged: data.commentsWithBadWordsCount,
        joinedDate: data.user.createdAt || 'N/A', // Ensure joinedDate exists
      });
      setCommentHistory(data.badWordsHistory);
    } catch (error) {
      console.error('Error fetching user history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  const highlightBadWords = (comment, badWords) => {
    const words = comment.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
      if (badWords.includes(cleanWord)) {
        return (
          <span key={index} className="mx-1">
            <Badge variant="destructive">{word}</Badge>
          </span>
        );
      }
      return <span key={index}>{word} </span>;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      {/* User Profile Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 rounded-full p-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-sm text-gray-500">Member since {formatDate(userData.joinedDate)}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{userData.totalComments}</p>
                <p className="text-sm text-gray-500">Total Comments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{userData.totalFlagged}</p>
                <p className="text-sm text-gray-500">Flagged Comments</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-gray-600">
        <AlertCircle size={18} className="text-red-500" />
        <h2 className="text-lg font-semibold">Comment History</h2>
      </div>
      
      {/* Comment History Cards */}
      <div className="space-y-4">
        {commentHistory.map((item) => (
          <Card key={item._id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="p-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm text-gray-500">
                  {formatDate(item.date)}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen size={16} className="text-blue-500" />
                  <span className="font-medium">{item.book.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700 leading-relaxed">
                    {highlightBadWords(item.comment, item.badWords)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-gray-500">
                    {item.badWords.length} flagged {item.badWords.length === 1 ? 'word' : 'words'}
                  </div>
                  <div className="flex gap-2">
                    {item.badWords.map((word, index) => (
                      <Badge key={index} variant="outline">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BadWordsHistory;
