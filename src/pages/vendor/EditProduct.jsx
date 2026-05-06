import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import baseApi from "../../js/BaseApi";

export default function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);   // for NEW images picked by user
    const [existingImages, setExistingImages] = useState([]); // images already on the product
    const [newImageFiles, setNewImageFiles] = useState([]);   // File objects to upload
    const [removedImageIds, setRemovedImageIds] = useState([]); // ids to delete on server

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: ""
    });

    const [error, setError] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: ""
    });

    // Fetch product and populate form
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await baseApi.get(`/products/${productId}`);
                const p = res.data;

                setFormData({
                    name: p.name || "",
                    brand: p.brand || "",
                    description: p.description || "",
                    price: p.price || "",
                    quantity: p.quantity || "",
                    categoryId: p.category?.id || ""  // store id, not name, for the select
                });

                // Populate existing images for preview
                // Adjust the URL path to match your backend's image serving endpoint
                if (p.images && p.images.length > 0) {
                    setExistingImages(p.images);
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
            }
        };

        fetchProduct();
    }, [productId]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await baseApi.get("/categories");
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        if (value.trim() === "") {
            setError(prev => ({ ...prev, [name]: `${name} is required` }));
        } else {
            setError(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Handle newly selected image files
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setNewImageFiles(prev => [...prev, ...files]);

        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...urls]);
    };

    // Remove a newly added (not yet uploaded) image
    const removeNewImage = (index) => {
        URL.revokeObjectURL(previewUrls[index]); // clean up blob URL
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Remove an existing image (mark for deletion)
    const removeExistingImage = (imageId) => {
        setRemovedImageIds(prev => [...prev, imageId]);
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append("productId", productId);
            data.append("name", formData.name);
            data.append("brand", formData.brand);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("quantity", formData.quantity);
            data.append("categoryId", formData.categoryId);

            // // Append each new image file
            // newImageFiles.forEach(file => {
            //     data.append("images", file);
            // });

            // // Tell the backend which existing images to remove
            // removedImageIds.forEach(id => {
            //     data.append("removedImageIds", id);
            // });

            await baseApi.put(`/products/${productId}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            navigate(-1); // go back after success
        } catch (err) {
            console.error("Failed to update product", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                        Update Product
                    </h1>
                    <p className="mt-3 text-lg text-zinc-500">
                        Fill in the details below to update item in your store.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 sm:p-10">
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
                                    {error.name && <p className="text-red-500 text-xs mt-1">{error.name}</p>}
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
                                    {error.brand && <p className="text-red-500 text-xs mt-1">{error.brand}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="categoryId" className="block text-sm font-semibold text-zinc-700">Category</label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        required
                                        value={formData.categoryId}   // ✅ now controlled
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none text-zinc-700"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                                        placeholder="Describe your product's key features..."
                                    />
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

                                    {/* Existing images from server */}
                                    {existingImages.length > 0 && (
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-2">Existing Images</p>
                                            <div className="grid grid-cols-3 gap-3">
                                                {existingImages.map((img) => (
                                                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                                                        {/*
                                                          Adjust the src URL to match your backend's image-serving route.
                                                          Common patterns:
                                                            - img.imageUrl  (if your entity has a full URL field)
                                                            - `/api/images/${img.fileName}`
                                                            - `http://localhost:8080/images/${img.fileName}`
                                                        */}
                                                        <img
                                                            src={img.imageUrl ?? `/api/images/${img.fileName}`}
                                                            alt={`Product image ${img.id}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(img.id)}
                                                            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span className="text-white text-xs font-semibold">Remove</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Newly added image previews */}
                                    {previewUrls.length > 0 && (
                                        <div>
                                            <p className="text-xs text-zinc-500 mb-2">New Images</p>
                                            <div className="grid grid-cols-3 gap-3">
                                                {previewUrls.map((url, index) => (
                                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
                                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewImage(index)}
                                                            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        >
                                                            <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span className="text-white text-xs font-semibold">Remove</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
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
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Updating Product...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Update Product
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