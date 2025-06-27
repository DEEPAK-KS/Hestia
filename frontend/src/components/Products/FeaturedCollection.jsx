import React from 'react'
import { Link } from 'react-router-dom'
import featured from '../../assets/featured.webp' 


const FeaturedCollection = () => {
  return (
    <section className="py-5 px-5    lg:px-25">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl">
            {/* LefyContent */}
            <div className="lg:w-1/2 p-8 text-center lg:text-left">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Comfort And Style
                </h2>
                <h2 className="text-xl lg:text-5xl font-bold mb-6">
                    Apparel made for everyday life
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                    Discover our latest collection of apparel designed for comfort and style. Whether you're at home or on the go, our clothing is made to fit your lifestyle.
                </p>
                <Link to="/collectons/all" className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800">Shop Now</Link>
            </div>
            {/* RightContent */}
            <div className="lg:w-1/2">
                <img
                    src={featured}
                    alt="Featured Collection"
                    className="w-full h-auto object-cover rounded-tr-3xl sm:rounded-tl-3xl lg:rounded-tl-none  lg:rounded-br-3xl shadow-lg"
                />
            </div>
        </div>
           
    </section>
  )
}

export default FeaturedCollection