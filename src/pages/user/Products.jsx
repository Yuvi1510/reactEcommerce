import { useState, useEffect } from "react";
import baseApi from "../../js/BaseApi";
import { NavLink } from "react-router-dom";
import ProductDetail from "../../components/common/ProductDetail";
import ProductDisplay from "../../components/common/ProductDisplay";

export default function Products({products}){

  return (
   <>

    {/* all products  */}
   <ProductDisplay products={products} title="All Products" subtitle="Explore our wide range of products." />
    </>
  );
}