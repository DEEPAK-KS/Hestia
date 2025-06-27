import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import register from '../assets/register.webp'; 
import { useDispatch, useSelector } from 'react-redux';
import { mergeCart } from '../redux/slice/cartSlice';
import { registerUser } from '../redux/slice/authSlice';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const {user, guestId, loading} = useSelector((state) => state.auth)
  const {cart} = useSelector((state) => state.cart)

  // get the redirect parameter and check if its checkout or something
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';
  const isCheckoutRedirect = redirect.includes("checkout");
  
  useEffect (() => {
    if (user){
      if (cart?.products.length > 0 && guestId){
        dispatch(mergeCart({guestId, user})).then(()=>{
          navigate(isCheckoutRedirect ? "/checkout" : "/")
        })
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/")
      }
    }
  },[user, guestId, cart, navigate, isCheckoutRedirect, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, name, password }));
  }

  return (
    <div className='flex '>
      <div className="w-ful md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className="flex justify-center mb-6">
            <h2 className='text-xl font-medium'>Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 ">Hey there 🖐️!</h2>
          <p className="text-center mb-6">Enter your username and password to Login</p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your Name'/>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your email Address'/>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your Password'/>
          </div>
          <button type='submit' className='w-full bg-black text-white p-2 rounded-lg font-semibold transition'>
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <p className="mt-6 text-center text-sm">
            Already have an account? <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500 hover:underline'>Sign In</Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center  item-center">
          <img src={register} alt="login to Account" className='h-[750px] w-full object-cover' />
        </div>
      </div>
    </div>
  )
}

export default Register