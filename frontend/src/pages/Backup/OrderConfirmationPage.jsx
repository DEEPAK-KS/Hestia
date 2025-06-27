import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {clearCart} from '../redux/slice/cartSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';



const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { checkout } = useSelector((state) => state.checkout);
    console.log(checkout);  
    // clear the cart when the order is confirmed
    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart());
            localStorage.removeItem('cart');
        } else {
            navigate('/my-orders');
        }
    }, [checkout, dispatch, navigate]);

    const calculateEstimatedDelivery = (orderDate) => {
        const date = new Date(orderDate);
        date.setDate(date.getDate() + 10); // Add 10 days for estimated delivery
        return date.toLocaleDateString();
    }
  return (  
    <div className='max-w-4xl mx-auto p-6 bg-white'>
        <h1 className="text-4xl font-bold text-center text-emerald-400 mb-8">Thank you for your order</h1>
        {checkout && (
            <div className="border rounded-lg p-6 ">
                <div className="flex justify-between mb-20">
                    {/* Order ID and Date */}
                    <div className="">
                        <h2 className="text-xl font-semibold">Order-ID : {checkout._id}</h2>
                        <p className="text-gray-500">Order date : {new Date(checkout.createdAt).toLocaleDateString()}</p>
                    </div>
                    {/* Estimated deliver */}
                    <div >
                        <p cclassName="text-emerald-700 text-sm">Estimated Delivery : {calculateEstimatedDelivery(checkout.createdAt)}</p>
                    </div>
                </div>
                {/* Order Items */}
                <div className="mb-20">
                    {checkout.checkoutItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between mb-4">
                            <div className='flex items-center'>
                            {/* <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md mr-4" /> */}
                            <div>
                                <h4 className="text-md font-semibold">{item.product.name}</h4>
                                <p className="text-gray-500 text-sm">{item.product.color} | {item.product.size}</p>
                            </div>
                            </div>
                            <div className='ml=auto text-right'>
                                <p className="text-gray-500 text-sm">Quantity: {item.product.quantity}</p>
                                <p className="text-gray-500 text-md">Price: ${item.product.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Payment and delivery info */}
                <div className="grid grid-cols-2">
                    {/* Payment info */}
                    <div className="text-lg font-semibold mb-2">
                        <h4 className="text-lg semi-bold mb-2">Payment Method</h4>
                        <p className='text-gray-600'>PayPal</p>
                    </div>
                    {/* delivery info */}
                    <div>
                    <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                    <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                    <p className="text-gray-600">{checkout.shippingAddress.city}, {checkout.shippingAddress.state} {checkout.shippingAddress.zipCode}</p>
                    <p className="text-gray-600">{checkout.shippingAddress.country}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default OrderConfirmationPage