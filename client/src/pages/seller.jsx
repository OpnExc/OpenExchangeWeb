import React, { useState } from 'react';
import { BiPlus, BiStore, BiLineChart, BiEdit  } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { categories } from '../data/categories';
import axios from 'axios';

const Seller = () => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    category : '',
    description: '',
    image: null
  });

  const myListings = [
    {
      id: 1,
      title: "Study Table",
      price: "₹1,200",
      views: 45,
      image: "https://images.pexels.com/photos/289444/pexels-photo-289444.jpeg",
      createdAt: "2024-03-15",
      status: "Active"
    }
  ];

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        await axios.post("http://localhost:8080/items", newItem);
        console.log("Success uploading item");
        setIsAddingItem(false);
        setSelectedCategory(null);
        setNewItem({
          title: '',
          price: '',
          description: '',
          category: '',
          image: null
        });
    }
    catch(e){
      console.log("Uploading error : ", e);
      alert("Error uploading item");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem({ ...newItem, image: file });
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 pt-28 min-h-screen">
      <div className="mx-auto px-4 container">
        {/* Dashboard Header */}
        <div className="bg-white/20 backdrop-blur-md mb-8 p-6 border border-white/30 rounded-2xl">
          <div className="flex justify-between items-center">
            <h1 className="bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 font-bold text-transparent text-4xl">
              Seller Dashboard
            </h1>
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg px-6 py-3 rounded-xl text-white transition-all duration-300"
            >
              <BiPlus className="text-xl" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-8">
          {[
            { label: "Total Items", value: myListings.length, icon: BiStore },
            { label: "Total Views", value: "238", icon: FiEye },
            { label: "Active Listings", value: "5", icon: BiLineChart }
          ].map((stat, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-md p-6 border border-white/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <stat.icon className="text-blue-600 text-3xl" />
                <div>
                  <h3 className="text-gray-600">{stat.label}</h3>
                  <p className="font-bold text-gray-800 text-2xl">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Selection Modal */}
        {isAddingItem && !selectedCategory && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 text-center mx-4 p-8 rounded-2xl w-full max-w-2xl">
              <h2 className="mb-6 font-bold text-2xl">Select Category</h2>
              <div className="gap-4 grid grid-cols-2 sm:grid-cols-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className="hover:bg-blue-50 p-4 border border-gray-200 hover:border-blue-500 rounded-xl transition-all duration-300"
                  >
                    <category.icon className="mb-2 text-blue-600 text-3xl" />
                    <span className="text-gray-700">{category.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsAddingItem(false)}
                className="mt-6 px-4 py-2 rounded-xl bg-gray-600 text-gray-300 hover:text-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Item Form Modal */}
        {isAddingItem && selectedCategory && (
          <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/95 mx-4 p-8 rounded-2xl w-full max-w-2xl">
              <h2 className="mb-6 font-bold text-2xl">Add {selectedCategory.name}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block mb-2 text-gray-700">Item Photo</label>
                  <div 
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="p-8 border-2 border-gray-300 border-dashed rounded-xl text-center cursor-pointer"
                  >
                    {newItem.image ? (
                      <img
                        src={URL.createObjectURL(newItem.image)}
                        alt="Preview"
                        className="mx-auto max-h-48"
                      />
                    ) : (
                      <div>
                        <BiPlus className="mx-auto mb-2 text-gray-400 text-4xl" />
                        <p className="text-gray-500">Click to upload photo</p>
                      </div>
                    )}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-gray-700">Item Name</label>
                    <input
                      required
                      type="text"
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Description</label>
                  <textarea
                    required
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
                    rows="4"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingItem(false);
                      setSelectedCategory(null);
                      setNewItem({...newItem, title:'', price: '', description:'', image: null});
                    }}
                    className="px-5 py-3 rounded-xl bg-gray-700 text-gray-300 hover:text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg px-6 py-2 rounded-xl text-white transition-all duration-300"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="bg-white/20 backdrop-blur-md p-6 border border-white/30 rounded-2xl">
          <h2 className="mb-6 font-bold text-2xl">My Items</h2>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {  
            myListings.map((item) => (
              <div key={item.id} className="bg-white/30 backdrop-blur-md border border-white/30 rounded-xl overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="top-3 right-3 absolute flex space-x-2">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-300">
                      <BiEdit className="text-gray-600 text-xl" />
                    </button>
                    <div className="flex items-center space-x-1 bg-white/80 px-3 py-1 rounded-full">
                      <FiEye className="text-gray-600" />
                      <span className="text-gray-600 text-sm">{item.views}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <span className="font-bold text-blue-600">{item.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Listed on {item.createdAt}</span>
                    <span className="bg-green-100 px-2 py-1 rounded-full text-green-700 text-sm">
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
