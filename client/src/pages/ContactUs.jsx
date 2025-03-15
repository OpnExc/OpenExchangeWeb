import React from 'react';

const ContactUs = () => {
  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-4 font-bold text-2xl">Contact Us</h1>
      <form className="bg-white shadow-md mb-4 px-8 pt-6 pb-8 rounded">
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="name">
            Name
          </label>
          <input
            className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
            id="name"
            type="text"
            placeholder="Your Name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="email">
            Email
          </label>
          <input
            className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
            id="email"
            type="email"
            placeholder="Your Email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700 text-sm" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow px-3 py-2 border rounded focus:shadow-outline focus:outline-none w-full text-gray-700 leading-tight appearance-none"
            id="message"
            placeholder="Your Message"
            required
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded focus:shadow-outline focus:outline-none font-bold text-white"
            type="submit"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;