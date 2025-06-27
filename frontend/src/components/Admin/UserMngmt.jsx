import React, { use, useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {addUser,updateUser,deleteUser, fetchUsers } from '../../redux/slice/adminSlice';


const UserMngmt = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.auth);
    const {users, loading, error} = useSelector((state) => state.admin);

    useEffect(() => {
        if(user && user.role !== "Admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user && user.role === "Admin") {
            dispatch(fetchUsers());
        }
    }, [dispatch, user]);  


    const [formData, setFormData] = useState({
    name:"",
    email:"",
    role: "customer", //Default
    password:""
});
const handleChange = (e) =>{
    setFormData({
        ...formData,
        [e.target.name] : e.target.value
    })
    console.log(formData)
}

const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));
    // Reset form
    setFormData({
        name: "",
        email: "",
        role: "Customer",
        password: ""
    });
}

const handleRoleChange = async (userID, newRole) => {
    await dispatch(updateUser({ id: userID, role: newRole }));
    dispatch(fetchUsers()); // Refresh the users list after update
}

const handleDeleteUser = (userID) => {
    if (window.confirm("Are you sure you want to delete the user?")) {
        dispatch(deleteUser(userID));
    }
}


return (
    <div className='max-w-7xl mx-auto p-6'>
        <h2 className="text-2xl font-bold mb-6">
            User Management
        </h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {/* New User Form */}
        <div className="p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        required
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add User
                </button>
            </form>
        </div>
        {/* List Users */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-gray-500">
                <thead className='bg-gray-100 text-xs text-gray-700'>
                    <tr>
                        <th className="px-6 py-3 ">Name</th>
                        <th className="px-6 py-3 ">Email</th>
                        <th className="px-6 py-3 ">Role</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, idx) => (
                        <tr key={user._id} className="text-center border-b">
                            <td className="px-6 py-4 ">{user.name}</td> 
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4 ">
                                <select
                                    value={user.role} 
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    className="rounded border px-2 py-1"
                                >
                                    <option value="Customer">Customer</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 ">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    onClick={() => { handleDeleteUser(user._id) }} // Fixed function name
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)
}

export default UserMngmt