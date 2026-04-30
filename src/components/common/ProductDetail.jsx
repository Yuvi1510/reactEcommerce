import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await baseApi.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      {loading ? (
        <div className="text-center text-lg font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* LEFT: Image Section */}
          <div>
            {/* Main Image */}
            <div className="w-full aspect-square bg-zinc-100 rounded-2xl overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={`${baseApi.defaults.baseURL}/images/${images[imageIndex].imageName}`}
                  alt={product.name}
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={`${baseApi.defaults.baseURL}/images/${img.imageName}`}
                  alt="thumb"
                  onClick={() => setImageIndex(index)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition 
                    ${
                      imageIndex === index
                        ? "border-[hsl(162,100%,24%)]"
                        : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4">
                {product.name}
              </h1>

              <p className="text-zinc-500 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="text-3xl font-black text-[hsl(162,100%,24%)] mb-6">
                ${Number(product.price || 0).toFixed(2)}
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.quantity > 0 ? (
                  <span className="text-sm font-semibold text-green-600">
                    In Stock ({product.quantity})
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-red-500">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-[hsl(162,100%,24%)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
                Buy Now
              </button>
              <button onClick={() => dispatch(addToCart(product.oroductId))} className="flex-1 border border-zinc-300 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}