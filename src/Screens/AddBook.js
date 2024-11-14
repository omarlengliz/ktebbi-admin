import React, { useEffect, useState } from "react";
import { Upload, X, DollarSign, Plus, Trash2, Edit2 } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Together from "together-ai";
import bookService from "../services/bookservices";
import genreServices from "../services/genreservices";
import { redirect } from "react-router-dom";

// Together AI setup
const together = new Together({
  apiKey: "6a50dbe4e49e7e983707298108887f41fe27b40709ee0840f9d9dcec64f4a24b", // Replace with your API Key
});

// Base64 to Blob conversion
const base64ToBlob = (base64Data, contentType = 'image/png') => {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const AddBook = () => {
  const [bookData, setBookData] = useState({
    title: "",
    language: "",
    price: "",
    imageUrl: null, // Store image Blob here
    genre: "",
    description: "", // Added description field for AI generation
    chapters: [], // Ensure chapters is always an array
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [genres, setGenres] = useState([]);
  const [generatingImage, setGeneratingImage] = useState(false); // Image generation loading state
  const [editingChapter, setEditingChapter] = useState(null); // State to track editing chapters

  // Fetch genres on component mount
  useEffect(() => {
    genreServices
      .getGenres()
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch genres:", error);
        toast.error("Failed to fetch genres. Please try again.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData((prev) => ({ ...prev, imageUrl: file })); // Store Blob directly
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setBookData((prev) => ({ ...prev, imageUrl: null }));
    setPreviewUrl(null);
  };

  // Generate cover image using Together AI
  const handleGenerateImage = async () => {
    if (!bookData.description) {
      toast.error("Please enter a description before generating a cover image.");
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: `Design a professional and visually appealing book cover with the title "${bookData.title}". The cover should reflect the ${bookData.genre} genre and visually convey the theme: ${bookData.description}. The design should be modern, eye-catching, and family-friendly.`,
        width: 512,
        height: 512,
        response_format: "b64_json",
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const base64Image = response.data[0].b64_json;
      const dataUrl = `data:image/png;base64,${base64Image}`;
      const imageBlob = base64ToBlob(base64Image); // Convert base64 to Blob

      setPreviewUrl(dataUrl); // Display the generated image
      setBookData((prev) => ({ ...prev, imageUrl: imageBlob })); // Store Blob in imageUrl
      toast.success("Cover image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
  };

  const addChapter = () => {
    setBookData((prev) => ({
      ...prev,
      chapters: [...prev.chapters, { title: "", content: "" }],
    }));
  };

  const updateChapter = (index, field, value) => {
    const updatedChapters = [...bookData.chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setBookData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const removeChapter = (index) => {
    const updatedChapters = bookData.chapters.filter((_, i) => i !== index);
    setBookData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const validateForm = () => {
    if (!bookData.title) {
      toast.error("Book title is required");
      return false;
    }
    if (!bookData.genre) {
      toast.error("Please select a genre");
      return false;
    }
    if (!bookData.imageUrl) {
      toast.error("Book cover image is required");
      return false;
    }
    if (!Array.isArray(bookData.chapters) || bookData.chapters.length === 0) {
      toast.error("Book must have at least one chapter");
      return false;
    }
    for (let i = 0; i < bookData.chapters.length; i++) {
      const chapter = bookData.chapters[i];
      if (!chapter.title) {
        toast.error(`Chapter ${i + 1} title is required`);
        return false;
      }
      if (!chapter.content) {
        toast.error(`Chapter ${i + 1} content is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData(); // Use FormData to handle Blob data
      formData.append("title", bookData.title);
      formData.append("language", bookData.language);
      formData.append("price", bookData.price);
      formData.append("genre", bookData.genre);
      formData.append("description", bookData.description);
      formData.append("imageUrl", bookData.imageUrl); // Append Blob to FormData

      bookData.chapters.forEach((chapter, index) => {
        formData.append(`chapters[${index}][title]`, chapter.title);
        formData.append(`chapters[${index}][content]`, chapter.content);
      });

      bookService
        .addBook(bookData) // Send FormData object to the server
        .then((response) => {
          console.log(response);
          toast.success("Book added successfully!");
          redirect("/author/books");
        })
        .catch((error) => {
          console.error("Failed to add book:", error);
          toast.error("Failed to add book. Please try again.");
        });

      console.log("Submitting book:", bookData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Book
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Book Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={bookData.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Price and Language (On the same row) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Language Select */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700"
                >
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={bookData.language}
                  onChange={handleInputChange}
                >
                  <option value="">Select a language</option>
                  <option value="arabic">Arabic</option>
                  <option value="english">English</option>
                  <option value="french">French</option>
                </select>
              </div>

              {/* Price Input */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (Leave empty for free book)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    aria-describedby="price-currency"
                    value={bookData.price}
                    onChange={handleInputChange}
                    style={{ width: "100px" }}
                  />
                </div>
              </div>
            </div>

            {/* Genre Select */}
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700"
              >
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                className="block w-full px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                value={bookData.genre}
                onChange={handleInputChange}
              >
                <option value="">Select a genre</option>
                {genres.map((genre, index) => (
                  <option key={index} value={genre._id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Input for AI Cover */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Book Description for AI Cover Generation
              </label>
              <textarea
                name="description"
                id="description"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={bookData.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>

            {/* Image Upload and Generation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Book Cover
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Book cover preview"
                        className="mx-auto h-64 w-auto"
                      />
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
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>
                        {previewUrl ? "Change image" : "Upload a file"}
                      </span>
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

                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={generatingImage}
                    className={`mt-3 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      generatingImage ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {generatingImage ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
              </div>
            </div>

            {/* Chapters Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chapters</h3>
              {bookData.chapters.map((chapter, index) => (
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
                        onChange={(event, editor) =>
                          updateChapter(index, "content", editor.getData())
                        }
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
                className="mt-2 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus size={20} className="mr-2" />
                Add Chapter
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
