import React from "react";

export default function Home() {
  return (
    <div className="p-10">

      {/* HERO */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6">
          Hire Elite Freelancers 🚀
        </h1>

        <p className="text-gray-400 mb-8">
          Premium marketplace for top talent
        </p>

        {/* SEARCH */}
        <div className="flex justify-center">
          <input
            placeholder="Search services..."
            className="w-80 p-3 rounded-l bg-secondary border border-gray-700"
          />

          <button className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black px-6 rounded-r shadow-gold">
            Search
          </button>
        </div>
      </div>

      {/* FEATURED */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Services</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((item) => (
            <div
              key={item}
              className="bg-secondary p-6 rounded-xl hover:shadow-gold transition"
            >
              <h3 className="text-lg font-bold mb-2">Logo Design</h3>

              <p className="text-gray-400 mb-4">
                Professional branding service
              </p>

              <button className="text-gold">View</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}