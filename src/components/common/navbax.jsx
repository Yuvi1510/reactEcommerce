import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Store } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '../../js/cartSlice';
import baseApi from '../../js/BaseApi';

export default function Navbar({categories}) {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const categoryRef = useRef(null);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsCategoriesOpen(false);
    }, [location.pathname]);

    // Fetch cart items on mount if authenticated
    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");
            if (token && token !== "null" && token !== "undefined") {
                try {
                    const res = await baseApi.get("/cart");
                    dispatch(setCartItems(res.data));
                } catch (err) {
                    console.log("Failed to fetch cart:", err);
                }
            }
        };
        fetchCart();
    }, [dispatch]);

    // Close categories dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoriesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100 shadow-sm font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-emerald-700 transition-colors">
                                E
                            </div>
                            <span className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                                Corner<span className="text-emerald-600">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
                        <NavLink to="/" className={({isActive}) => `text-[15px] font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-zinc-600 hover:text-emerald-600'}`}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={({isActive}) => `text-[15px] font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-zinc-600 hover:text-emerald-600'}`}>
                            Products
                        </NavLink>
                        
                        {/* Categories Dropdown */}
                        <div className="relative" ref={categoryRef}>
                            <button 
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className={`flex items-center gap-1 text-[15px] font-semibold transition-colors ${isCategoriesOpen ? 'text-emerald-600' : 'text-zinc-600 hover:text-emerald-600'}`}
                            >
                                Categories
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {isCategoriesOpen && (
                                <div className="absolute top-full mt-4 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.08)] border border-zinc-100 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-left">
                                    <div className="p-2">
                                        <div className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                            Popular Categories
                                        </div>
                                        {categories.map((cat, idx) => (
                                            <Link 
                                                key={idx} 
                                                to={`/categories/${cat.categoryId}`}
                                                className="block px-4 py-2.5 text-sm text-zinc-700 font-medium hover:bg-zinc-50 hover:text-emerald-600 rounded-xl transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-zinc-50 border-t border-zinc-100">
                                        <Link to="/categories" className="block text-center text-sm text-emerald-600 font-semibold hover:text-emerald-700">
                                            View All Categories →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <NavLink to="/about" className={({isActive}) => `text-[15px] font-semibold transition-colors ${isActive ? 'text-emerald-600' : 'text-zinc-600 hover:text-emerald-600'}`}>
                            About Us
                        </NavLink>
                    </nav>

                    {/* Right Action Icons & Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative group hidden lg:block">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                className="w-56 pl-10 pr-4 py-2.5 bg-zinc-100 text-sm text-zinc-900 border-transparent rounded-full focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500" />
                        </div>

                        <Link to="/cart" className="relative p-2 text-zinc-600 hover:text-emerald-600 hover:bg-zinc-50 rounded-full transition-all">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {cartItems.length}
                            </span>
                        </Link>

                        <div className="h-6 w-px bg-zinc-200 mx-1"></div>

                        <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-emerald-600 transition-colors">
                            <User className="w-4 h-4" />
                            Sign In
                        </Link>
                        
                        <Link to="/store-registration" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-emerald-600 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            <Store className="w-4 h-4" />
                            Become a Vendor
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <Link to="/cart" className="relative p-2 text-zinc-600 hover:text-emerald-600">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                                {cartItems.length}
                            </span>
                        </Link>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-zinc-600 hover:text-emerald-600 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-100 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                <div className="px-4 py-6 space-y-6 overflow-y-auto max-h-[80vh]">
                    {/* Mobile Search */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search for anything..." 
                            className="w-full pl-11 pr-4 py-3 bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    </div>

                    <nav className="flex flex-col gap-2">
                        <NavLink to="/" className={({isActive}) => `px-4 py-3 rounded-xl font-semibold transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-zinc-700 hover:bg-zinc-50'}`}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={({isActive}) => `px-4 py-3 rounded-xl font-semibold transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-zinc-700 hover:bg-zinc-50'}`}>
                            Products
                        </NavLink>
                        <div className="px-4 py-3">
                            <div className="font-bold text-zinc-400 text-xs uppercase tracking-wider mb-3">Categories</div>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.slice(0, 4).map((cat, idx) => (
                                    <Link key={idx} to={`/categories/${cat.categoryId}`} className="text-sm text-zinc-600 hover:text-emerald-600 py-1 font-medium">
                                        {cat.name}
                                    </Link>
                                ))}
                                <Link to="/categories" className="text-sm text-emerald-600 py-1 font-bold">
                                    View All →
                                </Link>
                            </div>
                        </div>
                        <NavLink to="/about" className={({isActive}) => `px-4 py-3 rounded-xl font-semibold transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-zinc-700 hover:bg-zinc-50'}`}>
                            About Us
                        </NavLink>
                    </nav>

                    <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
                        <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-100 transition-colors">
                            <User className="w-5 h-5" />
                            Sign In
                        </Link>
                        <Link to="/store-registration" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md">
                            <Store className="w-5 h-5" />
                            Become a Vendor
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}