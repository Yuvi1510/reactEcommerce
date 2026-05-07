import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function VendorNavbar() {
 const {isLoggedIn, user} = useSelector(state => state.auth);
 
 
 return (
        <nav className="bg-zinc-800 text-white p-4 shadow-md sticky top-0 left-0">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">
                    <Link to="/vendor">{user?.store?.name}</Link>
                </div>
                <ul className="flex space-x-6">
                    <li>
                        <Link 
                            to="/" 
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/vendor" 
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/vendor/products" 
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/vendor/add-product" 
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Add Product
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/vendor/orders" 
                            className="hover:text-zinc-300 transition-colors"
                        >
                            Orders
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
