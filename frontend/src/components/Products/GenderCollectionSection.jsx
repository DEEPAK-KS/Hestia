import React from 'react'
import mensCollection from '../../assets/mens-collection.webp'
import womensCollection from '../../assets/womens-collection.webp'
import { Link } from 'react-router-dom'

const GenderCollectionSection = () => {
  return (
    <section className='py-14 px-5 lg:px-30'>
        <div className="container mx-auto flex flex-col md:flex-row gap-8">
            {/* Womens Collecttion */}
            <div className="relative flex-1">
                <img src={womensCollection} alt="womensCollection" className='w-full h-[600px] object-cover'/>
                <div className='absolute bottom-8 left-8 bg-white custom-bg p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Womens Collection
                    </h2>
                    <Link to='/collections/all?gender=Women' className='text-gray-900 underline'>Shop Now</Link>
                </div>
            </div>
            {/* Mens Collection */}
            <div className="relative flex-1">
                <img src={mensCollection} alt="mensCollection" className='w-full h-[600px] object-cover'/>
                <div className='absolute bottom-8 left-8 bg-white custom-bg p-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                        Mens Collection
                    </h2>
                    <Link to='/collections/all?gender=Men' className='text-gray-900 underline'>Shop Now</Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default GenderCollectionSection
