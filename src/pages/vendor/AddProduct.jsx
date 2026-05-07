import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import baseApi from '../../js/BaseApi';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: ''
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [storeId, setStoreId] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await baseApi.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs for the newly added files
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // It's good practice to revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Constructing FormData to handle file uploads as required by the backend
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('brand', formData.brand);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('quantity', formData.quantity);
    submitData.append('category', formData.categoryId);
    // submitData.append('storeId', storeId); 
    
    images.forEach((img) => submitData.append('images', img));

    try {
      console.log('Submitting data to backend...');
      // Logging the FormData payload for debugging purposes
      for (let pair of submitData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      
      const res = await baseApi.post('/products', submitData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(res.data);
      
      toast.success("Product added successfully!", {
    autoClose: 1000 // 1 second
});
      
      // Reset form
      setFormData({ name: '', brand: '', description: '', price: '', quantity: '', categoryId: '' });
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product.", {
    autoClose: 1000 // 1 second
});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Add New Product
          </h1>
          <p className="mt-3 text-lg text-zinc-500">
            Fill in the details below to list a new item in your store.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 sm:p-10">
            {/* <input type="hidden" name="storeId" value={storeId} /> */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Product Info Column */}
              <div className="lg:col-span-7 space-y-7">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-zinc-700">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none placeholder:text-zinc-400"
                    placeholder="e.g. Premium Wireless Headphones"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="brand" className="block text-sm font-semibold text-zinc-700">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none placeholder:text-zinc-400"
                    placeholder="e.g. Sony"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="categoryId" className="block text-sm font-semibold text-zinc-700">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    // value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none text-zinc-700"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-zinc-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none placeholder:text-zinc-400 resize-none"
                    placeholder="Describe your product's key features, specifications, and benefits..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="block text-sm font-semibold text-zinc-700">Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-zinc-400 font-semibold">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none placeholder:text-zinc-400"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="quantity" className="block text-sm font-semibold text-zinc-700">Inventory Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none placeholder:text-zinc-400"
                      placeholder="e.g. 50"
                    />
                  </div>
                </div>
              </div>

              {/* Images Column */}
              <div className="lg:col-span-5 space-y-7">
                <div className="space-y-2 h-full flex flex-col">
                  <label className="block text-sm font-semibold text-zinc-700">Product Images</label>
                  
                  {/* Styled Drag and drop / upload area */}
                  <div className="flex-1 min-h-[200px] mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 border-dashed rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-400 transition-colors duration-200 relative group cursor-pointer">
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                    <div className="space-y-2 text-center flex flex-col items-center justify-center pointer-events-none">
                      <svg className="mx-auto h-12 w-12 text-zinc-400 group-hover:text-emerald-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-zinc-600 justify-center">
                        <span className="font-semibold text-emerald-600">Upload files</span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-zinc-500">PNG, JPG, GIF files supported</p>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                          <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <svg className="w-6 h-6 text-white mb-1 drop-shadow-md transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="text-white text-xs font-semibold">Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-zinc-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:-translate-y-0.5 active:scale-95 hover:from-emerald-700 hover:to-teal-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Product...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Submit Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}