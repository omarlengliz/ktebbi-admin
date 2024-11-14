import React, { useEffect, useState } from 'react';
import { Plus, Book, Edit3, Trash2, Eye } from 'lucide-react'; // Import icons for edit and delete
import { useNavigate } from 'react-router-dom';
import bookService from '../services/bookservices'; // Book services
import { toast } from 'react-toastify';

const BookPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };
    fetchBooks();
  }, [books]);

  const handleDeleteBook = async (bookId) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
      
      toast.success('Book deleted successfully');
    } catch (error) {
      toast.error('Failed to delete book');
      console.error('Failed to delete book:', error);
    }
  };


  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Books</h1>
          
        </div>

        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Book className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-xl text-gray-600">No books available</p>
            <p className="text-gray-500 mt-2">
              Click the button above to create your first book!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="relative bg-white rounded-lg shadow-md overflow-hidden group">
                <img
                  src={"https://ktebbibackend.azurewebsites.net/" + book.imageUrl}
                  alt={book.name}
                  className="w-full h-48 object-cover"
                />

                {/* Hover overlay with icons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center space-x-4 transition-opacity duration-300">
                  {/* Update Icon */}
                  <button 
                    onClick={() => navigate(`/admin/books/${book._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  >
                    <Eye size={24} />
                  </button>

                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{book.name}</h2>
                  <p className="text-gray-600 mb-1">Language: {book.language}</p>
                  <p className="text-gray-600 mb-1">
                    Released: {new Date(book.releaseDate).toLocaleDateString()}
                  </p>

                  {/* Badges Section */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-purple-200 text-purple-800 text-sm font-semibold px-2 py-1 rounded-full">
                      {book.genre.name}
                    </span>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        book.price === 0 || !book.price
                          ? 'bg-green-200 text-green-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      {book.price === 0 || !book.price ? 'Free' : `$${book.price}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
