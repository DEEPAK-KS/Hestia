import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import { Toaster } from 'sonner'
import Homepg from './pages/Homepg'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CollectionPage from './pages/CollectionPage'
import ProductDetail from './components/Products/ProductDetail'
import Checkout from './components/Cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetails from './pages/OrderDetails'
import MyOrderPage from './pages/MyOrderPage'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomepage from './pages/AdminHomepage'
import UserMngmt from './components/Admin/UserMngmt'
import ProductManagement from './components/Admin/ProductManagement'
import EditProduct from './components/Admin/EditProduct'
import Ordermanagement from './components/Admin/Ordermanagement'
import ProtectRoute from './components/Common/ProtectRoute'


import {Provider} from 'react-redux';
import store from './redux/store'

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route path = "/" element={<UserLayout />}> {/* User Layout */} 
        <Route index element={<Homepg/>}/>
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} /> 
        <Route path="profile" element={<Profile/>} /> 
        <Route path="collections/:collection" element={<CollectionPage/>} /> 
        <Route path="product/:Id" element={<ProductDetail/>} /> 
        <Route path="checkout" element={<Checkout/>} /> 
        <Route path="order-confirmation" element={<OrderConfirmationPage/>} />
        <Route path="order/:id" element={<OrderDetails/>}/>
        <Route path="my-orders" element={<MyOrderPage/>}/>
        </Route>
        {/* Admin Side */}
        <Route path="/admin" element={
          <ProtectRoute role="Admin">
            <AdminLayout/>
          </ProtectRoute>
        }>
          <Route index element={<AdminHomepage/>}/>
          <Route path="users" element={<UserMngmt/>}/>
          <Route path="products" element={<ProductManagement/>}/>
          <Route path="/admin/products/:id/edit" element={<EditProduct/>}/>
          <Route path="orders" element={<Ordermanagement/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter></Provider>
  )
}

export default App
