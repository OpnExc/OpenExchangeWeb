import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPopup from './LoginPopup';

const AmazonSellerSignup = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');
    setIsLoggedIn(!!googleAuth || !!jwtAuth);
  }, []);

  const handleSignUpClick = () => {
    const googleAuth = localStorage.getItem('google');
    const jwtAuth = localStorage.getItem('jwt');
    
    if (googleAuth || jwtAuth) {
      navigate('/app/listItem');
    } else {
      setShowLoginPopup(true);
    }
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Improved Wavy Background for the top */}
      <svg
        className="absolute top-0 left-0 w-full h-[400px]"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          fill="#EBF8FA"
          fillOpacity="1"
          d="M0,128L80,144C160,160,320,192,480,186.7C640,181,800,139,960,128C1120,117,1280,139,1360,149.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </svg>

      {/* Hero Banner Section */}
      <div className="container mx-auto px-12 py-16 flex flex-col md:flex-row items-center relative z-10">
        <div className="md:w-1/2 pl-64">
          <h1 className="text-5xl font-bold text-[#131A22] mb-4">
            {isLoggedIn ? 'Start Selling' : 'Become a seller'}
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            {isLoggedIn 
              ? 'List your items and start selling today.'
              : 'Sell on Amazon.in, India\'s most visited shopping destination.'}
          </p>
          <button
            className="bg-black text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md transition-all"
            onClick={handleSignUpClick}
          >
            {isLoggedIn ? 'Sell Items' : 'Sign up'}
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center relative mt-6 md:mt-0">
          <div className=" rounded-full p-2 relative inline-block shadow-lg">
            <img
              src="/api/placeholder/300/300"
              alt="Amazon seller"
              className="rounded-full object-cover border-4 border-white"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Amazon Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#131A22]">
            Why Choose Amazon?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Join the largest online marketplace and reach millions of customers.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <img
                src="/api/placeholder/80/80"
                alt="Growth"
                className="w-16 h-16 mb-2"
              />
              <h3 className="text-lg font-semibold">Rapid Growth</h3>
              <p className="text-gray-700 text-sm">
                Expand your business nationwide with ease.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/api/placeholder/80/80"
                alt="Support"
                className="w-16 h-16 mb-2"
              />
              <h3 className="text-lg font-semibold">24/7 Support</h3>
              <p className="text-gray-700 text-sm">
                Get assistance anytime to streamline your operations.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/api/placeholder/80/80"
                alt="Secure Payments"
                className="w-16 h-16 mb-2"
              />
              <h3 className="text-lg font-semibold">Secure Payments</h3>
              <p className="text-gray-700 text-sm">
                Receive your earnings on time, every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Testimonials Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="bg-[#F5F9FA] rounded-lg p-8 max-w-4xl mx-auto">
          <h2 className=" text-4xl font-bold text-center mb-8">
            Here's what Amazon.in sellers are saying:
          </h2>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <img
                src="/api/placeholder/100/100"
                alt="Seller 1"
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">CRACK OF DAWN CRAFTS</h3>
                <p className="text-gray-700 italic">
                  “From five members to fifteen, a little trust can go a long
                  way.”
                </p>
                <p className="font-semibold">Sunehra Koshi</p>
                <p className="text-gray-600 text-md">
                  Founder, Crack of Dawn Crafts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src="/api/placeholder/100/100"
                alt="Seller 2"
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold">GOODNESS PET FOOD</h3>
                <p className="text-gray-700 italic">
                  “We went from sales of 10,000 rupees to 5 lakh in just two and
                  a half years.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Selling Today Section (Full-width wave) */}
      <div className="relative w-full h-auto  overflow-hidden mt-12">
        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-12 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-[#131A22] mb-4">
              Start selling today
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Put your products in front of crores of customers across India.
            </p>
            <button className="bg-black text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-[#E68A00] transition-all ">
              Start Selling
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center relative mt-6 md:mt-0">
            {/* Replace with your actual plane/illustration image */}
            <img
              src="/api/placeholder/500/500"
              alt="Amazon Selling"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
        {/* Wave at the bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-auto"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#EBF8FA"
            fillOpacity="1"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,186.7C672,181,768,139,864,138.7C960,139,1056,181,1152,208C1248,235,1344,245,1392,250.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={() => {
            setShowLoginPopup(false);
            navigate('/app/listItem');
          }}
        />
      )}
    </div>
  );
};

export default AmazonSellerSignup;
