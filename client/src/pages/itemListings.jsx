import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const ItemListings = () => {
  const items = [
    {
      id: 1,
      title: "Study Table",
      price: "₹1,200",
      condition: "Like New",
      image: "https://images.pexels.com/photos/289444/pexels-photo-289444.jpeg",
      seller: "John Doe",
      hostel: "Boys Hostel Block A"
    },
    {
      id: 2,
      title: "HP Laptop",
      price: "₹35,000",
      condition: "Excellent",
      image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
      seller: "Sarah Smith",
      hostel: "Girls Hostel Block B"
    },
    {
      id: 3,
      title: "Engineering Books Set",
      price: "₹800",
      condition: "Good",
      image: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg",
      seller: "Mike Johnson",
      hostel: "Boys Hostel Block B"
    },
    {
      id: 4,
      title: "Scientific Calculator",
      price: "₹1,500",
      condition: "Like New",
      image: "https://images.pexels.com/photos/167682/pexels-photo-167682.jpeg",
      seller: "Emma Wilson",
      hostel: "Girls Hostel Block A"
    },
    {
      id: 5,
      title: "Drawing Board",
      price: "₹600",
      condition: "Good",
      image: "https://images.pexels.com/photos/159627/pencil-office-design-creative-159627.jpeg",
      seller: "Alex Brown",
      hostel: "Boys Hostel Block A"
    },
    {
      id: 6,
      title: "Desk Lamp",
      price: "₹450",
      condition: "New",
      image: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg",
      seller: "Lisa Anderson",
      hostel: "Girls Hostel Block B"
    },
    {
      id: 7,
      title: "Mini Refrigerator",
      price: "₹8,000",
      condition: "Good",
      image: "https://images.pexels.com/photos/5824901/pexels-photo-5824901.jpeg",
      seller: "David Clark",
      hostel: "Boys Hostel Block B"
    },
    {
      id: 8,
      title: "Office Chair",
      price: "₹2,500",
      condition: "Like New",
      image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
      seller: "Rachel Green",
      hostel: "Girls Hostel Block A"
    },
    {
      id: 9,
      title: "Bookshelf",
      price: "₹1,800",
      condition: "Excellent",
      image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg",
      seller: "Tom Wilson",
      hostel: "Boys Hostel Block A"
    },
    {
      id: 10,
      title: "Electric Kettle",
      price: "₹900",
      condition: "Good",
      image: "https://images.pexels.com/photos/1080808/pexels-photo-1080808.jpeg",
      seller: "Emily Davis",
      hostel: "Girls Hostel Block B"
    },
    {
      id: 11,
      title: "Wall Clock",
      price: "₹350",
      condition: "New",
      image: "https://images.pexels.com/photos/280277/pexels-photo-280277.jpeg",
      seller: "Chris Martin",
      hostel: "Boys Hostel Block B"
    },
    {
      id: 12,
      title: "Study Materials Set",
      price: "₹600",
      condition: "Good",
      image: "https://images.pexels.com/photos/6476783/pexels-photo-6476783.jpeg",
      seller: "Sophie Turner",
      hostel: "Girls Hostel Block A"
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 pt-28 min-h-screen">
      {/* Search Section */}
      <div className="mx-auto mb-8 px-4 container">
        <div className="bg-white/20 backdrop-blur-md p-6 border border-white/30 rounded-2xl">
          <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-6 font-bold text-transparent text-4xl">
            Item Listings
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="bg-white/50 backdrop-blur-sm p-4 pl-12 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <BiSearch className="top-1/2 left-4 absolute text-gray-500 text-xl -translate-y-1/2 transform" />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="mx-auto px-4 container">
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
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
                  <AiOutlineHeart className="text-gray-600 hover:text-red-500 text-xl" />
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
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md mt-4 py-2 rounded-lg w-full text-white transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemListings;