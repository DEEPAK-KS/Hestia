import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slice/orderSlice';

const OrderDetails = () => {
    // Extract the order ID from the URL parameters
    const {id} = useParams();
    const dispatch = useDispatch(); 
    const {orderDetails, loading, error} = useSelector((state) => state.order);

    useEffect(() => {
        // Dispatch the action to fetch order details by ID
        dispatch(fetchOrderDetails(id));
    }, [dispatch, id]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }
    if (error) {
        return <div className="text-center py-4 text-red-500">Error: {error}</div>;
    }



  
return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6'>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
        {orderDetails ? (
            <div className="p-4 sm:p-6 rounded-lg border">
                {/* Order info */}
                <div className="flex flex-col sm:flex-row justify-between mb-8">
                    <h3 className="text-lg md:text-xl font-semibold">Order-ID: sw#{orderDetails._id}</h3>
                    <p className="text-gray-600">{new Date(orderDetails.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                    <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}>
                        {orderDetails.isPaid ? "Paid" : "Pending"}
                    </span>
                    <span className={`${orderDetails.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium`}>
                        {orderDetails.isDelivered ? "Delivered" : "Not Delivered"}
                    </span>
                </div>
                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
                                        <p className="text-gray-600">{orderDetails.paymentMethod}</p>
                                        <p className="text-gray-600">Status: {orderDetails.paymentStatus}</p>
                                        {orderDetails.isPaid && (
                                            <p className="text-green-600 text-sm">Paid At: {new Date(orderDetails.paidAt).toLocaleString()}</p>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
                                        <p className="text-gray-600">Address:</p>
                                        <p>
                                            {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">Order Status</h4>
                                        <p className="text-gray-600">Status: {orderDetails.status}</p>
                                        <p className="text-gray-600">Total: ${orderDetails.totalPrice.toFixed(2)}</p>
                                        <h4 className="text-md font-semibold mb-2">Delivery Date</h4>
                                        <p className="text-gray-600">
                                            {new Date(new Date(orderDetails.createdAt).getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* Product List */}
                <div className="overflow-x-auto">
                    <h4 className="text-lg font-semibold mb-4">Products</h4>
                    <table className="min-w-full bg-white">
                        <thead className='bg-gray-100'>
                            <tr className="border-b">
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Quantity</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.orderItems.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link to={`/product/${item.productId}`} className="text-blue-500 hover:underline">
                                            {item.name}
                                        </Link>
                                    </td>                       
                                    <td className="px-6 py-4">{item.quantity}</td>
                                    <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Link to="/my-orders" className='text-blue-500 hover:underline mt-6 inline-block'>Back to My Orders</Link>
            </div>
        ) : (
            <p>No order details found</p>
        )}
    </div>
)
}

export default OrderDetails