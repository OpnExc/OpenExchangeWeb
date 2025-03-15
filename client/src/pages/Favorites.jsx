import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BiShare } from 'react-icons/bi';

const Favorites = () => {
  const favoriteItems = [
    {
      id: 1,
      title: "Study Table",
      price: "₹1,200",
      condition: "Like New",
      image: "https://example.com/study-table.jpg",
      seller: "John Doe",
      hostel: "Boys Hostel Block A"
    },
    // Add more items as needed
  ];

  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 pt-28 min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 opacity-40 pointer-events-none [mask-image:linear-gradient(0deg,white,transparent)]"></div>
      
      <div className="mx-auto px-4 sm:px-6 lg:px-8 container">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 font-bold text-transparent text-4xl">
            My Favorites
          </h1>
          <p className="mt-2 text-gray-600">Items you've saved for later</p>
        </div>

        {/* Favorites Grid */}
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white/20 hover:shadow-xl backdrop-blur-md border border-white/30 rounded-xl overflow-hidden transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <button className="top-3 right-3 absolute bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-300">
                  <AiFillHeart className="text-red-500 text-xl" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                  <span className="font-bold text-blue-600">{item.price}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">Condition: {item.condition}</p>
                  <p className="text-gray-600 text-sm">Seller: {item.seller}</p>
                  <p className="text-gray-600 text-sm">Location: {item.hostel}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md px-4 py-2 rounded-lg text-white transition-all duration-300">
                    Contact Seller
                  </button>
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                    <BiShare className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {favoriteItems.length === 0 && (
          <div className="py-16 text-center">
            <AiOutlineHeart className="mx-auto mb-4 text-gray-400 text-6xl" />
            <h2 className="mb-2 font-semibold text-gray-700 text-2xl">No favorites yet</h2>
            <p className="text-gray-600">Start adding items to your favorites list!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;