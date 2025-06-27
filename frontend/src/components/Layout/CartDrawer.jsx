import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io';
import CartContents from '../Cart/CartContents';
import Checkout from '../Cart/Checkout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartDrawer = ({drawerOpen, toggleCartDrawer}) => {
    const navigate = useNavigate();
    const handleCheckOut = () => {
        if (!user) {
            navigate('/login?redirect=checkout');
        }else{
            navigate('/checkout');
        }
        
    }
    const {user, guestId} = useSelector((state) => state.auth);
    const {cart} = useSelector((state) => state.cart)
    const userId = user ? user._id : null

    const handleCheckOutAndClose = () => {
        toggleCartDrawer();
        handleCheckOut();
    };

    // Close drawer when clicking outside the drawer
    const handleBackdropClick = (e) => {
        // Only close if the backdrop itself is clicked, not the drawer
        if (e.target === e.currentTarget) {
            toggleCartDrawer();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 ${drawerOpen ? '' : 'pointer-events-none'}`}
            style={{ backgroundColor: drawerOpen ? 'rgba(0,0,0,0.3)' : 'transparent' }}
            onClick={handleBackdropClick}
        >
            <div
                className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-1/4 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <div className='flex justify-end p-4 '>
                    <button onClick={toggleCartDrawer}>
                        <IoMdClose className='h-6 w-6 text-gray-600'/>
                    </button>
                </div>
                {/* Cart Content with scroll */}
                <div className="flex-grow p-4 overflow-y-auto ">
                    <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
                    {cart && cart?.products?.length > 0 ? ( <CartContents cart={cart} userId={userId} guestId={guestId} />) : (<p>Your cart is empty</p>)}
                    {/* Component for cart */}
                   
                </div>
                {/* Checkout button fixed at bottom */}
                {cart && cart?.products?.length > 0 && (
                    <>
                        <div onClick={handleCheckOutAndClose} className="p-4 bg-white fixed bottom-0">
                    <button className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800'>
                        Checkout
                    </button>
                    <p className='text-sm tracking-tight text-gray-500 mt-2 text-center'>
                        Shipping, Taxes and discounts are Calculated at the checkout
                    </p>
                </div>
                    </>
                )}
                
            </div>
        </div>
    );
}

export default CartDrawer