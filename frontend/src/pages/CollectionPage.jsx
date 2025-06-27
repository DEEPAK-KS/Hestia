import React, { useEffect, useState, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slice/productsSlice';

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
    
  }, [dispatch, collection, searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex flex-col lg:flex-row'>
      {/* Mobile filter button */}
      <button className='lg:hidden flex justify-center items-center p-2'>
        <p className='flex cursor-pointer' onClick={toggleSidebar} >
          <FaFilter className='mr-2 cursor-pointer' /> Filters
        </p>
      </button>
      <div className="hidden sm:flex-grow p-4">
        <h2 className='text-2xl uppercase mb-4'>All Collection</h2>
      </div>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 inset-y-0 overflow-y-auto left-0 w-64 h-full bg-white shadow-lg transition-transform duration-300 z-50 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className='hidden lg:flex text-2xl uppercase mb-4'>All Collection</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
