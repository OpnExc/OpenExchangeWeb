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
      className="relative bg-gray-800 opacity-0 pt-8  text-white transition-all translate-y-10 duration-1000 ease-out"
    >
      <div className="mx-auto px-4 container">
        {/* Wave decoration at the top */}
        

        {/* Main Footer Content */}
        <div className="flex flex-wrap mb-0 text-left lg:text-left">
          {/* About Section */}
          <div className="mb-0 lg:mb-0 px-4 w-full lg:w-4/12">
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
          <div className=" lg:mb-0 px-4 w-full lg:w-4/12">
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
        <hr className="mt-0 mb-2 border-white border-opacity-20" />
        
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
     
     
    </footer>
  );
}

export default Footer;
