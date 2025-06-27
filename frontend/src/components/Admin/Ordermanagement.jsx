import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slice/adminOrderSlice';


const Ordermanagement = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user} = useSelector((state) => state.auth);
    const {orders, loading, error} = useSelector((state) => state.adminOrders);

    useEffect(() => {
        if(!user || user.role !== "Admin") {
            navigate("/");
        } else {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, navigate, user]);


    const handleStatusChange = async (order_ID, status) => {
        await dispatch(updateOrderStatus({ id: order_ID, status }))
        if(status === "Delivered") {
            dispatch(fetchAllOrders());
        }
    }
    if(loading) {
        return <div className="text-center py-6">Loading...</div>
    }
    if(error) {
        return <div className="text-center py-6 text-red-500">{error}</div>
    }
return (
    <div className='max-w-7xl mx-auto p-6'>
        <h2 className="text-2xl font-bold mb-6">Order Management</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className='py-3 px-4'>Order ID</th>
                        <th className='py-3 px-4'>User</th>
                        <th className='py-3 px-4'>Total Price</th>
                        <th className='py-3 px-4'>Status</th>
                        <th className='py-3 px-4'>Change Status</th>
                        <th className='py-3 px-4'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order._id} className="bg-white border-b hover:bg-gray-50 cursor-pointer">
                                <td className='py-3 px-4 font-medium text-gray-900 whitespace-nowrap'>{order._id}</td>
                                <td className='py-3 px-4 font-medium text-gray-900 whitespace-nowrap'>{order.user.name}</td>
                                <td className='py-3 px-4 font-medium text-gray-900 whitespace-nowrap'>${order.totalPrice.toFixed(2)}</td>
                                <td className='py-3 px-4 capitalize font-medium text-gray-900 whitespace-nowrap'>{order.status}</td>
                                <td className='py-3 px-4'>
                                    <select
                                        className="border rounded px-2 py-1 font-medium text-gray-900 whitespace-nowrap focus:ring-blue-500 focus:border-blue-500 block"
                                        defaultValue={order.status}
                                        onChange={e => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className='py-3 px-4'>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                        disabled={order.status === "Delivered"}
                                        onClick={() => handleStatusChange(order._id, "Delivered")}
                                    >
                                        Mark as Delivered
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
)
}

export default Ordermanagement