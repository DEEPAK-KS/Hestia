import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {fetchAdminProducts, deleteProduct} from '../../redux/slice/adminProductSlice';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.adminProducts);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);
    const handleDelete = (id) =>{
        if(window.confirm("Are you sure you want to delete this product?"))
        {
            dispatch(deleteProduct(id));
        }
    }
if (loading) {
    return <div className="text-center py-6">Loading products...</div>;
}
if (error) {
    return <div className="text-center py-6 text-red-500">Error: {error}</div>;
}

return (
    <div className='max-w-7xl mx-auto p-6'>
        <h2 className="text-2xl font-bold mb-6">Product Management</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                    <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">SKU</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                                <Link to={`/product/${product._id}`}>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{product._id}</td>
                                </Link>
                                <td className="px-6 py-4 font-medium whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 font-medium whitespace-nowrap">{product.price}</td>
                                <td className="px-6 py-4 font-medium whitespace-nowrap">{product.sku}</td>
                                <td className="px-6 py-4 ">
                                    <Link
                                        to={`/admin/products/${product._id}/edit`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-gray-400">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
)
}

export default ProductManagement