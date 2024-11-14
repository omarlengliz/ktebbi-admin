import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookService from '../services/bookservices';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([
    { user: 'Alice', content: 'Great book, really enjoyed it!', date: '2023-10-12' },
    { user: 'Bob', content: 'Very insightful, a must-read!', date: '2023-11-01' },
    { user: 'Charlie', content: 'Good book but a bit lengthy.', date: '2023-11-05' },
  ]);
  const [newReview, setNewReview] = useState('');

  const fetchBook = async () => {
    try {
      const response = await bookService.getBookById(id);
      setBook(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch book:', error);
    }
  };

  const handleReviewSubmit = () => {
    if (newReview.trim()) {
      const newReviewData = { user: 'Guest', content: newReview, date: new Date().toISOString().split('T')[0] };
      setReviews((prevReviews) => [...prevReviews, newReviewData]);
      setNewReview('');
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  if (isLoading) {
    return <div className="text-center my-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto my-8">
      <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Image and Reviews */}
        <div>
          {/* Book Image */}
          <img
            src={`https://ktebbibackend.azurewebsites.net/${book.imageUrl}`}
            alt={book.name}
            className="w-64 h-64 rounded-lg mb-6"
          />

          {/* Reviews Section */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-lg font-semibold">{review.user}</p>
                  <p className="text-gray-600">{review.date}</p>
                  <p className="text-gray-700 mt-2">{review.content}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Add Your Review</h3>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review here..."
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleReviewSubmit}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Book Details and Chapters */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{book.name}</h1>
          <p className="text-gray-500 mb-2">
            By {book.author?.firstname} {book.author?.lastname}
          </p>
          <p className="text-2xl font-bold mb-4">
            {book.price === 0 ? 'Free' : `$${book.price}`}
          </p>
          <p className="text-gray-500 mb-4">
            Language: {book.language} | Released:{' '}
            {book.releaseDate
              ? new Date(book.releaseDate).toLocaleDateString()
              : 'N/A'}
          </p>

          {/* Chapters */}
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold mb-4">Chapters</h2>
            {book.pageContent?.map((page, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-2">{page.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
