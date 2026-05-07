import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";
import { Trash2, Eye, ImageOff } from 'lucide-react';

export default function CarouselList({ refreshFlag }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await baseApi.get("/carousel");
      setImages(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this carousel item?")) {
      setIsLoading(true);
      try {
        await baseApi.delete(`/carousel/${id}`);
        fetchData();
      } catch (err) {
        console.log(err);
        alert("Failed to delete item");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageOff className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No carousel items</h3>
        <p className="text-gray-500">Upload your first carousel image to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="relative h-48 overflow-hidden">
            <img
              src={`http://localhost:8082/images/${item.imagePath}`}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="p-2 bg-white rounded-full text-gray-900 hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.subTitle}</p>
            <button
              onClick={() => deleteItem(item.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}