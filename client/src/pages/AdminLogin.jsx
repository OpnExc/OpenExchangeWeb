import React from "react";
import { Link } from "react-router-dom";

function AdminLogin() {
  return (
    <div 
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMTgtbXludC0wNS1qb2I1OTguanBn.jpg)` }}
    >
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1634363657957-d91ac22d230a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA=="
          alt="Signup Illustration" 
          className="w-full h-48 object-cover"
        />
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign up as ADMIN</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
          </div>
          <input 
            type="email" 
            placeholder="Email address" 
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition">SIGN UP</button>
          <br></br>
          <div className="text-center text-sm">
            Are you a user : <Link to={'/Login'} className="text-blue-500 hover:underline">Sign-in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin
