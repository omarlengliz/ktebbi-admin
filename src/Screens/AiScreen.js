import React, { useState } from "react";
import { Upload, X, DollarSign, ImageIcon, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Together from 'together-ai'; // Import Together AI

const together = new Together({
  apiKey: "6a50dbe4e49e7e983707298108887f41fe27b40709ee0840f9d9dcec64f4a24b",  // Use your Together API key
});

const GenrateBook = () => {
  const [bookData, setBookData] = useState({
    title: "",
    language: "",
    price: "",
    image: null,
    genre: "",
    description: "", // Added description field
    chapters: [],
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(false); // Image generation loading state
  const [width] = useState(512);  // Define width
  const [height] = useState(512); // Define height

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

  // Remove the uploaded image
  const removeImage = () => {
    setBookData((prev) => ({ ...prev, image: null }));
    setPreviewUrl(null);
  };

  // Generate cover image using Together AI with the description
  const handleGenerateImage = async () => {
    if (!bookData.description) {
      toast.error("Please enter a description before generating a cover image.");
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: bookData.description, // Use the description as a prompt
        width: width,
        height: height,
        // @ts-expect-error response_format is not defined in the type
        response_format: "b64_json",
      });

      const base64Image = response.data[0].b64_json;
      const dataUrl = `data:image/png;base64,${base64Image}`;
      setPreviewUrl(dataUrl); // Display the generated image
      setBookData((prev) => ({ ...prev, image: dataUrl })); // Store the image in bookData
      toast.success("Cover image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setGeneratingImage(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bookData.title || !bookData.language || !bookData.genre) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Add your book submission logic here (e.g., sending the data to a server)
    console.log("Book submitted:", bookData);
    toast.success("Book added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Book</h2>
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

            {/* Genre Input */}
            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-700"
              >
                Genre
              </label>
              <input
                type="text"
                name="genre"
                id="genre"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={bookData.genre}
                onChange={handleInputChange}
              />
            </div>

            {/* Language Input */}
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
                <option value="english">English</option>
                <option value="arabic">Arabic</option>
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
                  <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={bookData.price}
                  onChange={handleInputChange}
                />
              </div>
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
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Submit Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenrateBook;
