import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrder } from '../redux/slice/orderSlice';
import { useSelector } from 'react-redux';

const MyOrderPage = () => {
  
const navigate = useNavigate();
const dispatch = useDispatch();
const { orders, loading, error } = useSelector((state) => state.order);
useEffect(() => {
        dispatch(fetchUserOrder());
}, [dispatch]);
const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
}

if (loading) {
        return <div className="text-center py-4">Loading...</div>;
}       
if (error) {
        return <div className="text-center py-4 text-red-500">Error: {error}</div>;
}                                       

return (
        <div className='max-w-7xl mx-auto p-4 sm:p-6'>
                <h2 className='text-2xl font-bold mb-6'>My Orders</h2>
                <div className="relatice shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full lext-left text-gray-500">
                                <thead className="bg-gray-100 text-xs uppdecase text-gray-700">
                                        <tr>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Shipping Address</th>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                                                <th className="px-4 py-2 sm:py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                        </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.length > 0 ? (
                                                orders.map(order => (
                                                        <tr key={order.id} className='border-b hover:bg-gray-50 cursor-pointer' onClick={() => handleRowClick(order._id)}>
                                                                <td className="px-2 py-2 sm:py-4 sm:px-4 whitespace-nowrap">
                                                                        <img src={order.orderItems[0].image} alt={order.orderItems[0].name} 
                                                                                className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg'/>
                                                                </td>
                                                                <td className="px-2 py-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap">#{order._id}</td>
                                                                <td className="px-2 py-2 sm:py-4 sm:px-4">
                                                                        {new Date(order.createdAt).toLocaleString('en-IN', {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                        })}
                                                                </td>
                                                                <td className="px-2 py-2 sm:py-4 sm:px-4">
                                                                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                                                                </td>
                                                                <td className="px-2 py-2 sm:py-4 sm:px-4">{order.orderItems.length}</td>
                                                                <td className="px-2 py-2 sm:py-4 sm:px-4">₹{order.totalPrice}</td>
                                                                <td className="px-2 py-2 sm:py-4 sm:px-4">
                                                                        {order.isPaid ? (
                                                                                <span className="text-green-600 font-semibold">Paid</span>
                                                                        ) : (
                                                                                <span className="text-red-600 font-semibold">Unpaid</span>
                                                                        )}
                                                                </td>
                                                        </tr>
                                                ))
                                        ) : (
                                                <tr>
                                                        <td colSpan="7" className="text-center py-4 px-4 text-gray-500">No orders found.</td>
                                                </tr>
                                        )}
                                </tbody>
                        </table>
                </div>
        </div>
);
}

export default MyOrderPage;