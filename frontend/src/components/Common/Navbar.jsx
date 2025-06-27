import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight} from "react-icons/hi2"
import SearchBar from './SearchBar'
import CartDrawer from '../Layout/CartDrawer'
import { IoMdClose } from 'react-icons/io'
import { useSelector } from 'react-redux'
const Navbar = () => {
    const [drawerOpen,setDrawerOpen] = useState(false);
    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }
    const {user} = useSelector((state) => state.auth)
    const [navDrawerOpen, setNevDrawerOpen] = useState(false);
    const togglrNavDrawer = () =>{
        setNevDrawerOpen(!navDrawerOpen);
    }
    const {cart} = useSelector((state) => state.cart)
    const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0
  return (
    <>
    <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/* Logo */}
        <div>
            <Link to="/" className='text-2xl font-medium'>Hestia</Link>
        </div>
        {/* Center Nav Links */}
        <div className='hidden md:flex space-x-6 '>
            <Link to="/collections/all?gender=Men" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>MEN</Link>
            <Link to="/collections/all?gender=Women" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Women</Link>
            <Link to="/collections/all?category=Top+Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Top Weare</Link>
            <Link to="/collections/all?category=Bottom+Wear" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>Bottom Wear</Link>
        </div>
        {/* Right icons */}
        <div className='flex items-center space-x-4'>
            {user && user.role === 'Admin' && (
            <Link to="/admin" className='block bg-black px-2 rounded text-sm text-white'>Admin</Link>
            )}
            <Link to="/profile" className=' hover:text-black '>
                <HiOutlineUser className='h-6 w-6 text-gray-700' />
            </Link>
            <button onClick={toggleCartDrawer} className='realative hover:text-black'>
                <HiOutlineShoppingBag className='h-6 w-6 text-gray-700'/>
                {cartItemCount > 0 && (
                    <span className='absolute text-white bg-[#ea2e0e] rounded-full py-1 px-2 text-xs transform -translate-y-4'>{cartItemCount}</span>

                )}
            </button>
            {/* Search icon */}
            <div className='overflow-hidden'>
                <SearchBar/>
            </div>
        </div>
        <button className='md:hidden block' onClick={togglrNavDrawer}>
            <HiBars3BottomRight className='h-6 w-6 text-gray-700'/>
        </button>
    </nav>
    <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
    {/* Mobile NavBar */}
    <div className={`fixed top-0 left-0 w-3/4  sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg  transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-end p-4" onClick={togglrNavDrawer}>
            <IoMdClose className='h-6 w-6 text-grey-600'/>
        </div>    
        <div className="p-4">
            <h2 className="text-xl font-semibold md-4 pb-5">Menu</h2>
            <nav className='space-y-4'>
                <Link to="/collections/all?gender=Men" className='block text-gray-700 hover:text-black text-sm font-medium uppercase' onClick={togglrNavDrawer}>MEN</Link>
                <Link to="/collections/all?gender=Women" className='block text-gray-700 hover:text-black text-sm font-medium uppercase' onClick={togglrNavDrawer}>Women</Link>
                <Link to="/collections/all?category=Top+Wear" className='block text-gray-700 hover:text-black text-sm font-medium uppercase' onClick={togglrNavDrawer}>Top Weare</Link>
                <Link to="/collections/all?category=Bottom+Wear" className='block text-gray-700 hover:text-black text-sm font-medium uppercase' onClick={togglrNavDrawer}>Bottom Wear</Link>
            </nav>
        </div>
    </div>
    </>
  )
}

export default Navbar
