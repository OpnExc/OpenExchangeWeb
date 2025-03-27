import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Filter, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  FileText, 
  ClipboardList, 
  Settings,
  User
} from 'lucide-react';

const API_URL = 'http://localhost:8080';

const ServiceMarketplace = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Categories for filtering
  const categories = ['all', 'academic', 'technical', 'creative', 'errands', 'other'];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/services`);
        if (Array.isArray(response.data)) {
          setServices(response.data);
          setFilteredServices(response.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services by search query and category
  useEffect(() => {
    let result = [...services];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(service => 
        service.title.toLowerCase().includes(query) || 
        service.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(service => service.category.toLowerCase() === categoryFilter);
    }
    
    setFilteredServices(result);
  }, [searchQuery, categoryFilter, services]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleContactProvider = (service) => {
    // In a real app, you might want to redirect to a chat page or show contact info
    alert(`Contact ${service.provider} about "${service.title}"`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative bg-white pt-24 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative bg-white pt-24 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mx-auto max-w-2xl">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-4 h-8 w-8 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Services</h3>
                <p className="mt-2 text-red-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white pt-24 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Header with actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Service Marketplace</h1>
              <p className="text-gray-600 mt-1">Find services offered by students in your campus community</p>
            </div>
            
            {/* Primary Action Buttons */}
            <div className="flex items-center space-x-3">
              <a
                href="/app/service/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none transition-colors"
              >
                <Plus className="mr-2 -ml-1 h-5 w-5" />
                Offer a Service
              </a>
              <a
                href="/app/service/request"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <FileText className="mr-2 -ml-1 h-5 w-5" />
                Request a Service
              </a>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Search bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
                />
              </div>

              {/* Category filter */}
              <div className="flex items-center">
                <Filter className="text-gray-500 mr-2 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        categoryFilter === category
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service Listings Section */}
          <div className="mb-12">
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || categoryFilter !== 'all'
                    ? "No services match your search criteria."
                    : "There are no services available at the moment."}
                </p>
                {searchQuery || categoryFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                  >
                    Clear filters
                  </button>
                ) : (
                  <a
                    href="/app/service/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                  >
                    Offer a service
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mb-2">
                            {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                        </div>
                        <span className="font-bold text-gray-900">₹{service.price}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <User className="h-4 w-4 mr-1.5" />
                        <span>Offered by: {service.provider}</span>
                      </div>
                      
                      <button
                        onClick={() => handleContactProvider(service)}
                        className="w-full inline-flex justify-center items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none transition-colors"
                      >
                        Contact Provider
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Secondary Navigation */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/app/service-requests"
                className="group flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <ClipboardList className="h-6 w-6 text-gray-500 group-hover:text-black transition-colors" />
                <span className="ml-3 text-gray-700 group-hover:text-black font-medium transition-colors">Browse Service Requests</span>
              </a>
              <a
                href="/app/my-services"
                className="group flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-6 w-6 text-gray-500 group-hover:text-black transition-colors" />
                <span className="ml-3 text-gray-700 group-hover:text-black font-medium transition-colors">Manage My Services</span>
              </a>
              <a
                href="/app/my-service-requests"
                className="group flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <User className="h-6 w-6 text-gray-500 group-hover:text-black transition-colors" />
                <span className="ml-3 text-gray-700 group-hover:text-black font-medium transition-colors">My Service Requests</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMarketplace;