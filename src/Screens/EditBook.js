import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For accessing route params and navigation
import { Upload, X, DollarSign, Plus, Trash2, Edit2, Book } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bookService from "../services/bookservices";
import genreServices from "../services/genreservices";

const EditBook = () => {
  const { bookId } = useParams(); // Get bookId from the route
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    name: "",
    language: "",
    price: "",
    image: null,
    genre: "",
    author: "",
    pageContent: [], // Chapters will come from pageContent
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [editingChapter, setEditingChapter] = useState(null);

  // Fetch book data for editing
  useEffect(() => {
    // Fetch the book data using the bookId
    const fetchBookData = async () => {
      try {
        const response = await bookService.getBookById(bookId);
        const book = response.data;
        
        // Pre-fill the form with the fetched book data
        setBookData({
          name: book.name,
          language: book.language,
          price: book.price,
          image: book.imageUrl,
          genre: book.genre._id, // Use genre ID
          author: `${book.author.firstname} ${book.author.lastname}`,
          pageContent: book.pageContent,
        });

        // Set the image preview
        setPreviewUrl(`https://ktebbibackend.azurewebsites.net/${book.imageUrl}`);
      } catch (error) {
        console.error("Failed to fetch book data:", error);
        toast.error("Failed to fetch book data. Please try again.");
      }
    };

    // Fetch available genres
    const fetchGenres = async () => {
      try {
        const response = await genreServices.getGenres();
        setGenres(response.data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        toast.error("Failed to fetch genres. Please try again.");
      }
    };

    fetchBookData();
    fetchGenres();
  }, [bookId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setBookData((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
      setBookData((prev) => ({ ...prev, genre: newGenre }));
      setNewGenre("");
    }
  };

  const addChapter = () => {
    setBookData((prev) => ({
      ...prev,
      pageContent: [...prev.pageContent, { title: "", content: "" }],
    }));
  };

  const updateChapter = (index, field, value) => {
    const updatedChapters = [...bookData.pageContent];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setBookData((prev) => ({ ...prev, pageContent: updatedChapters }));
  };

  const removeChapter = (index) => {
    const updatedChapters = bookData.pageContent.filter((_, i) => i !== index);
    setBookData((prev) => ({ ...prev, pageContent: updatedChapters }));
  };

  // Validate form before submitting
  const validateForm = () => {
    if (!bookData.name) {
      toast.error("Book title is required");
      return false;
    }
    if (!bookData.genre) {
      toast.error("Please select a genre");
      return false;
    }
    if (!bookData.pageContent.length) {
      toast.error("Book must have at least one chapter");
      return false;
    }
    return true;
  };

  // Handle form submission (update the book)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await bookService.updateBook(bookId, bookData); // Update book using bookId
        toast.success("Book updated successfully!");
        navigate("/home"); // Redirect to the books list or another page after update
      } catch (error) {
        console.error("Failed to update book:", error);
        toast.error("Failed to update book. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Book</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Book Title
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none"
                value={bookData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Language & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md"
                  value={bookData.language}
                  onChange={handleInputChange}
                >
                  <option value="">Select a language</option>
                  <option value="arabic">Arabic</option>
                  <option value="english">English</option>
                  <option value="french">French</option>
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (Leave empty for free)
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="block w-full pl-10 border border-gray-300 rounded-md"
                    value={bookData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Genre Select */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  id="genre"
                  name="genre"
                  className="flex-1 block w-full px-3 py-2 border-gray-300 rounded-l-md"
                  value={bookData.genre}
                  onChange={handleInputChange}
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Book Cover</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Book cover preview" className="mx-auto h-64 w-auto" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <span>{previewUrl ? "Change image" : "Upload a file"}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                    {!previewUrl && <p className="pl-1">or drag and drop</p>}
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chapters</h3>
              {bookData.pageContent.map((chapter, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-medium">Chapter {index + 1}</h4>
                    <div>
                      <button
                        type="button"
                        onClick={() => setEditingChapter(index)}
                        className="text-indigo-600 hover:text-indigo-800 mr-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeChapter(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {editingChapter === index ? (
                    <>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, "title", e.target.value)}
                        className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Chapter Title"
                      />
                      <CKEditor
                        editor={ClassicEditor}
                        data={chapter.content}
                        onChange={(event, editor) => updateChapter(index, "content", editor.getData())}
                      />
                      <button
                        type="button"
                        onClick={() => setEditingChapter(null)}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Save Chapter
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">{chapter.title}</p>
                      <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: chapter.content }} />
                    </>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addChapter}
                className="mt-2 flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
              >
                <Plus size={20} className="mr-2" />
                Add Chapter
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Update Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
