import { useEffect, useState } from "react";
import Carousel from "../../components/users/carousel";
import Products from "./Products";
import baseApi from "../../js/BaseApi";
import { NavLink } from "react-router-dom";
import ProductDisplay from "../../components/common/ProductDisplay";

export default function Index({categories, featuredProducts}) {
  
  return (
    <div>
      <Carousel />

      <ProductDisplay products={featuredProducts} title="Featured Products" 
      subtitle="Discover our handpicked selection of premium items designed to
            elevate your everyday experience." />

      {/* shop by categories  */}
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-emerald-50/30 py-5 px-4 sm:px-6 lg:px-8 font-sans">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-600 tracking-tight mb-2">
            Shop by Category
          </h2>
          <p className="text-md text-zinc-500 max-w-2xl mx-auto">
            Explore our wide range of products organized by category.
          </p>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <NavLink
            to={`categories/${category.categoryId}`}
              key={index}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-2 border border-zinc-100"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={`${baseApi.defaults.baseURL}/images/${category.imageName}`}
                  alt={category.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
