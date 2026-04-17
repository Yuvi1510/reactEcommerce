export default function VendorFooter() {
    return (
        <footer className="bg-zinc-800 text-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold">Vendor Portal</span>
                        <p className="text-zinc-400 text-sm mt-1">Manage your store effortlessly.</p>
                    </div>
                    
                    <div className="flex space-x-4 text-sm text-zinc-300">
                        <a href="/vendor/help" className="hover:text-white transition-colors">Help Center</a>
                        <a href="/vendor/terms" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="/vendor/contact" className="hover:text-white transition-colors">Contact Support</a>
                    </div>
                </div>
                
                <div className="border-t border-zinc-700 mt-6 pt-4 text-sm text-center text-zinc-400">
                    &copy; {new Date().getFullYear()} eCommerce Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
