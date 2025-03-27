import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const footerRef = useRef(null);
  
  useEffect(() => {
    // Simple reveal animation for the footer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative bg-black opacity-0 pt-8 pb-6 text-white transition-all translate-y-10 duration-1000 ease-out"
    >
      <div className="mx-auto px-4 container">
        {/* Wave decoration at the top */}
        <div className="top-0 left-0 absolute w-full overflow-hidden">
          <svg 
            className="block relative w-full h-12"
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="opacity-20 fill-white"
            ></path>
          </svg>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-wrap mb-12 text-left lg:text-left">
          {/* About Section */}
          <div className="mb-10 lg:mb-0 px-4 w-full lg:w-4/12">
            <div className="group">
              <h4 className="mb-4 font-bold text-3xl group-hover:scale-105 transition-transform duration-300">OpenEx</h4>
              <div className="bg-white mb-4 rounded-full w-12 group-hover:w-24 h-1 transition-all duration-300"></div>
            </div>
            <p className="mb-4 text-gray-100 hover:text-white transition-colors duration-300">
              A student marketplace platform for buying, selling, and exchanging goods within your institute.
            </p>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => window.open('https://github.com/OpnExc/.github/tree/main/profile')} 
                className="group flex justify-center items-center bg-white shadow-lg hover:shadow-pink-400/30 hover:shadow-xl rounded-full outline-none focus:outline-none w-10 h-10 font-normal text-indigo-600 hover:scale-110 transition duration-300 transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button 
                onClick={() => window.open('https://discord.com/invite/openex')} 
                className="group flex justify-center items-center bg-white shadow-lg hover:shadow-purple-400/30 hover:shadow-xl rounded-full outline-none focus:outline-none w-10 h-10 font-normal text-indigo-600 hover:scale-110 transition duration-300 transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
                </svg>
              </button>
              <button 
                onClick={() => window.open('https://x.com/account/access')} 
                className="group flex justify-center items-center bg-white shadow-lg hover:shadow-indigo-400/30 hover:shadow-xl rounded-full outline-none focus:outline-none w-10 h-10 font-normal text-indigo-600 hover:scale-110 transition duration-300 transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-10 lg:mb-0 px-4 w-full lg:w-4/12">
            <div className="group">
              <h5 className="mb-4 font-bold text-xl group-hover:scale-105 transition-transform duration-300">Quick Links</h5>
              <div className="bg-white mb-4 rounded-full w-12 group-hover:w-20 h-1 transition-all duration-300"></div>
            </div>
            <ul className="list-none">
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/App/item-listings"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Browse Listings
                </Link>
              </li>
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/App/sell"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  List an Item
                </Link>
              </li>
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/App/favorites"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Favorites
                </Link>
              </li>
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/App/chat"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Chat
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="px-4 w-full lg:w-4/12">
            <div className="group">
              <h5 className="mb-4 font-bold text-xl group-hover:scale-105 transition-transform duration-300">Resources</h5>
              <div className="bg-white mb-4 rounded-full w-12 group-hover:w-20 h-1 transition-all duration-300"></div>
            </div>
            <ul className="list-none">
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/about"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  About Us
                </Link>
              </li>
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/home"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Community Guidelines
                </Link>
              </li>
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/home"
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-3">
                <Link 
                  className="group flex items-center hover:pl-2 text-gray-100 hover:text-white transition-colors duration-300"
                  to="/home" 
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        
        
        {/* Divider */}
        <hr className="my-6 border-white border-opacity-20" />
        
        {/* Copyright */}
        <div className="flex flex-wrap justify-center md:justify-between items-center">
          <div className="mx-auto md:mx-0 mb-4 md:mb-0 px-4 w-full md:w-4/12 md:text-left text-center">
            <div className="text-gray-100 text-sm">
              © {new Date().getFullYear()} OpenEx. All rights reserved.
            </div>
          </div>
          
          <div className="mx-auto md:mx-0 px-4 w-full md:w-8/12 text-center md:text-right">
            <div className="flex flex-wrap justify-center md:justify-end">
              <Link to="/home" className="px-3 py-1 text-gray-100 hover:text-white text-sm transition-colors duration-300">Terms</Link>
              <Link to="/home" className="px-3 py-1 text-gray-100 hover:text-white text-sm transition-colors duration-300">Privacy</Link>
              <Link to="/home" className="px-3 py-1 text-gray-100 hover:text-white text-sm transition-colors duration-300">Cookies</Link>
              <Link to="/home" className="px-3 py-1 text-gray-100 hover:text-white text-sm transition-colors duration-300">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="right-0 bottom-0 absolute opacity-10 pointer-events-none">
        <svg width="350" height="350" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFFFFF" d="M43.2,-57.2C56.4,-45.7,67.9,-32.5,72.5,-16.9C77.2,-1.3,75,16.8,66.7,31.1C58.4,45.4,44,56,28.4,63.1C12.8,70.2,-4,73.9,-20.8,70.7C-37.6,67.6,-54.5,57.6,-67.2,42.3C-79.9,27,-88.4,6.3,-85.7,-12.5C-83,-31.4,-69.1,-48.4,-52.9,-59.5C-36.7,-70.5,-18.4,-75.6,-1.3,-74C15.7,-72.4,30,-68.7,43.2,-57.2Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="top-12 left-12 absolute opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFFFFF" d="M48.2,-46.1C60.8,-34.4,68.5,-17.2,68.5,0C68.5,17.2,60.8,34.4,48.2,44.5C35.5,54.6,17.8,57.5,1.4,56.1C-15,54.7,-30,49,-42.1,38.9C-54.3,28.8,-63.5,14.4,-66.4,-2.9C-69.2,-20.2,-65.7,-40.4,-53.5,-52.1C-41.4,-63.8,-20.7,-66.9,-1.8,-65.1C17.1,-63.3,35.5,-57.7,48.2,-46.1Z" transform="translate(100 100)" />
        </svg>
      </div>
    </footer>
  );
}

export default Footer;
