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
      className="relative bg-black opacity-0 pt-8  text-white transition-all translate-y-10 duration-1000 ease-out"
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
                onClick={() => window.open('https://discord.com/invite/openex')} 
                className="group flex justify-center items-center bg-white shadow-lg hover:shadow-purple-400/30 hover:shadow-xl rounded-full outline-none focus:outline-none w-10 h-10 font-normal text-indigo-600 hover:scale-110 transition duration-300 transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" className="group-hover:rotate-12 transition-transform duration-300">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/>
                </svg>
              </button>
              <button 
                onClick={() => window.open('https://x.com/account/access')} 
                className="group flex justify-center items-center bg-white shadow-lg hover:shadow-indigo-400/30 hover:shadow-xl rounded-full outline-none focus:outline-none w-10 h-10 font-normal text-indigo-600 hover:scale-110 transition duration-300 transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" className="group-hover:rotate-12 transition-transform duration-300">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button 
  onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=hostelhustle77@gmail.com&su=Inquiry&body=Hello,%20I%20would%20like%20to%20ask%20about...')} 
  className="group flex justify-center items-center bg-white shadow-lg hover:shadow-indigo-400/30 hover:shadow-xl rounded-full outline-none focus:outline-none w-10 h-10 font-normal text-indigo-600 transform hover:scale-110 transition duration-300"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="black" className="group-hover:rotate-12 transition-transform duration-300">
    <path d="M2 6.5V18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6.5l-10 7-10-7zM20 4H4c-1.1 0-2 .9-2 2v.01l10 7 10-7V6c0-1.1-.9-2-2-2z"/>
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
                  to="/app/about"
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
                  to="/app/Guidelines"
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
                  to="/app/ourPrivacy"
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
                  to="/app/feedback" 
                >
                  <span className="inline-block mr-0 group-hover:mr-1 w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  Feedback
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
