import React from 'react'
import { Link } from 'react-router-dom'

const ProductGrid = ({ products, loading, error }) => {
    if(loading){
        return <p>Loading...</p>
    }
    if(error){
        return <p>Error: {error}</p>
    }
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
            {products.map((product, index) => (
                <Link key={index} to={`/product/${product._id}`} className='block'>
                    <div className="bg-white p-4 rounded-lg">
                        <div className="w-full h-96 mb-4">
                            <img
                                src={product.images[0].url}
                                alt={product.images[0].altext || product.name}
                                className="object-cover rounded-lg w-full h-full"
                            />
                        </div>
                        <h3 className="text-sm mb-2">{product.name}</h3>
                        <p className='text-gray-500 font-medium text-sm tracking'>
                            ${product.discountPrice}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default ProductGrid