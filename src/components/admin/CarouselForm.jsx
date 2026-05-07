import { useState } from "react";
import baseApi from "../../js/BaseApi";
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function CarouselForm({ refresh }) {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !subTitle || !file) {
      alert("Please fill all fields and select an image");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("file", file);

    try {
      const response = await baseApi.post("/carousel/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Uploaded successfully");
      
      // Add to uploaded images list
      setUploadedImages(prev => [{
        id: Date.now(),
        title,
        subTitle,
        preview
      }, ...prev]);
      
      setTitle("");
      setSubTitle("");
      setFile(null);
      setPreview(null);
      refresh();

    } catch (err) {
      console.log(err);
      alert("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setSubTitle("");
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload New Carousel Image</h2>
          <p className="text-sm text-gray-500 mt-1">Add new images to your homepage carousel</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl">
          <ImageIcon className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter carousel title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter carousel subtitle"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleFileChange}
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Choose an image</span>
              </label>
            </div>
            {file && (
              <p className="text-xs text-gray-500 mt-2">Selected: {file.name}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload Carousel"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Preview Section Below Form */}
      {preview && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <h3 className="text-white font-bold text-lg">{title || "Preview Title"}</h3>
                <p className="text-white/80 text-sm">{subTitle || "Preview Subtitle"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}