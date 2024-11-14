import React, { useState, useEffect } from 'react';
import { XCircleIcon, PlusCircleIcon } from 'lucide-react';
import genreServices from '../services/genreservices';
import { toast } from 'react-toastify';
import { Loader } from './Loader';

const BookGenreList = () => {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const data = await genreServices.getGenres();
        setLoading(false);

        setGenres(data.data);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    setLoading(true);

    if (newGenre.trim() !== '') {
      try {
        const addedGenre = await genreServices.addGenre({ name: newGenre });
        console.log('Added genre:', addedGenre);
        if (addedGenre.status =="success") {
          setGenres([...genres, addedGenre.data]);
          setNewGenre('');
          setShowModal(false);
          toast.success('Genre added successfully');
        }else{
          toast.error('Failed to add genre');
        }
        setLoading(false);
        // Add the newly created genre to the list
        setNewGenre('');
        setShowModal(false);
        
      } catch (error) {
        toast.error('Failed to add genre');
        console.error('Failed to add genre:', error);
      }
    }
  };

  const handleDeleteGenre = async (genreToDelete) => {
    setLoading(true);
    try {
    
    const isDeleted = await genreServices.deleteGenre(genreToDelete);
    console.log('Deleted genre:', isDeleted);
    if(isDeleted.status === "success"){
      setGenres(genres.filter((genre) => genre._id !== genreToDelete));
      toast.success('Genre deleted successfully');
    }else{
      toast.error('Failed to delete genre');
    }
    setLoading(false);
    }catch(error){
      console.error('Failed to delete genre:', error);
      toast.error('Failed to delete genre');
    }
  };
  if(loading){
    return <div className='flex justify-center items-center h-screen'><Loader/></div>
  } 
  return (
    <div className="container mx-auto my-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Book Genres</h2>
          <button
            className="text-primary-500 hover:text-primary-700 transition-colors duration-200"
            onClick={() => setShowModal(true)}
          >
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-md py-2 px-4 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-between"
            >
              {genre.name}
              <button
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                onClick={() => handleDeleteGenre(genre._id)}
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative">
              <h3 className="text-2xl font-bold mb-4">Add New Genre</h3>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="bg-gray-100 rounded-md py-2 px-4 flex-1 mr-4"
                  placeholder="Enter new genre"
                />
                <button
                  className="bg-primary-500 text-black rounded-md py-2 px-4 hover:bg-primary-700 transition-colors duration-200"
                  onClick={handleAddGenre}
                >
                  Save
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 mr-4"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookGenreList;
