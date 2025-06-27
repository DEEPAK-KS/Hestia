import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection'
import NewArivals from '../components/Products/NewArivals'
import ProductDetail from '../components/Products/ProductDetail'
import ProductGrid from '../components/Products/ProductGrid'
import { TbPlaceholder } from 'react-icons/tb'
import FeaturedCollection from '../components/Products/FeaturedCollection'
import FeaturesSection from '../components/Products/FeaturesSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slice/productsSlice'
import axios from 'axios'


const Homepg = () => {

  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state)=> state.products)
  const [bestSellerProducts, setBestSellerProducts] = useState(null);
  
  useEffect(()=>{
    // fetch products of a spcific collection
    dispatch(fetchProductsByFilters({
      gender:"Women",
      category: "Bottom Wear",
      limit: 8
    }));
    // fetch best seller
    const fetchBestSeller = async () =>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`)
        setBestSellerProducts(response.data)
      } catch (error) {
        console.log(error)
      }
    }
  fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
        <Hero/>
        <GenderCollectionSection/>
        <NewArivals/>
        {/* Best Seller */}
        <h2 className="text-3xl text-center font-bold mb-4"> Best Seller </h2>
        {bestSellerProducts ? (<ProductDetail productId={bestSellerProducts._id} />) : (<p className='text-center'>Loading best seller products...</p>)}
        <div className="container mx-auto lg:mx-25 max-w-full w-auto object-cover">
          <h2 className='tetx-3xl text-center font-bold mb-4'>
            Top Wear For Women
          </h2>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
        <FeaturedCollection/>
         <FeaturesSection/>
    </div>
  )
}

export default Homepg