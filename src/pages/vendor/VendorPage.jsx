import { Outlet } from "react-router-dom";
import VendorNavbar from "../../components/Vendor/VendorNavbar";
import VendorFooter from "../../components/Vendor/VendorFooter";
import { useState, useEffect } from "react";

export default function VendorPage(){
    const [storeName, setStoreName] = useState("");

    useEffect(() => {
        const storeName = localStorage.getItem("storeName");
        if(storeName != null ){
            setStoreName(storeName);
        }
    }, []);

    return(
        <>
        <VendorNavbar/>
            <Outlet/>
        <VendorFooter/>
        </>
    );
}