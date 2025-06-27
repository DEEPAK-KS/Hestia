import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile toggle btn */}
      <div className="flex md:hidden flex-row p-4 bg-gray-900 text-white z-30">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>
      {/* Sidebar */}
      <div>
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20  bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <div
          className={`
            fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30
            transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300
            md:translate-x-0 md:static md:block md:z-20
          `}
        >
          <AdminSidebar />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout