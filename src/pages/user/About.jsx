import React from 'react';
import { Link } from 'react-router-dom';
import reactCountUp from 'react-countup';
const CountUp = reactCountUp.default ? reactCountUp.default : reactCountUp;

export default function About() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-24 lg:pt-32 lg:pb-36 border-b border-zinc-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-900 tracking-tight mb-8">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Every User</span> <br className="hidden md:block" /> to Build Their Dream Store.
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-zinc-600 mx-auto leading-relaxed">
            E-Corner is a revolutionary multi-vendor ecosystem. We bridge the gap between passionate creators and global consumers, providing a frictionless platform for anyone to launch a business in minutes.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/store-registration" className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              Open Your Store
            </Link>
            <Link to="/products" className="px-8 py-4 bg-white text-zinc-700 border border-zinc-200 rounded-xl font-bold text-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300">
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div>
              <p className="text-4xl font-extrabold text-white">
                <CountUp enableScrollSpy scrollSpyOnce end={10} suffix="K+" duration={2.5} />
              </p>
              <p className="mt-2 text-emerald-100 font-medium">Active Vendors</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">
                <CountUp enableScrollSpy scrollSpyOnce end={1} suffix="M+" duration={2.5} />
              </p>
              <p className="mt-2 text-emerald-100 font-medium">Products Listed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">
                <CountUp enableScrollSpy scrollSpyOnce end={500} suffix="K+" duration={2.5} />
              </p>
              <p className="mt-2 text-emerald-100 font-medium">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-white">
                <CountUp enableScrollSpy scrollSpyOnce end={50} suffix="+" duration={2.5} />
              </p>
              <p className="mt-2 text-emerald-100 font-medium">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight sm:text-4xl">
              Why We Built E-Corner
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              We believe commerce should be democratized. Whether you are an artisan, a wholesaler, or a brand new entrepreneur, we give you the exact same powerful tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Lightning Fast Setup</h3>
              <p className="text-zinc-600 leading-relaxed">
                Forget complex hosting and coding. Enter your details, upload your products, and start selling globally within minutes, not months.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Global Reach</h3>
              <p className="text-zinc-600 leading-relaxed">
                Your localized storefront plugs directly into a powerful global marketplace. We handle the visibility, so you can focus on the quality.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Secure & Transparent</h3>
              <p className="text-zinc-600 leading-relaxed">
                Enjoy peace of mind with enterprise-grade security. Fair vendor commissions and instant payouts guarantee your business remains profitable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Vendor Highlight Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl transform -rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop" 
                alt="Store Owner" 
                className="relative rounded-3xl shadow-xl border border-zinc-200 aspect-[4/3] object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-extrabold text-zinc-900 mb-6">Designed For The Community, By The Community.</h2>
              <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                Traditional eCommerce platforms gatekeep features behind expensive tiers. Our multivendor concept flips the script. Every user profile has the inherent ability to transition into a robust storefront.
              </p>
              <ul className="space-y-4 mb-8 text-zinc-700">
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="font-medium">No hidden fees or complex API requirements</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="font-medium">Intuitive vendor dashboard & analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="font-medium">Direct communication between buyers and sellers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-teal-500 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to shape the future of commerce?</h2>
          <p className="text-xl text-zinc-300 mb-10">
            Join thousands of independent sellers and take control of your financial freedom today.
          </p>
          <Link to="/store-registration" className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-teal-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 transform hover:-translate-y-1">
            Create Your Free Store
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}