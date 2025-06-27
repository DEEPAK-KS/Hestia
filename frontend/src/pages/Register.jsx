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
  
  const {user, guestId, loading, error} = useSelector((state) => state.auth)
  const {cart} = useSelector((state) => state.cart)
  const [showPassword, setShowPassword] = useState(false);

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
            <h2 className='text-xl font-medium'>HESTIA</h2>
          </div>
          {/* Show error message if registration fails */}
          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {typeof error === "string" && error.toLowerCase().includes("server")
                ? "Please check the data entered."
                : error}
            </div>
          )}
          <h2 className="text-2xl font-bold text-center mb-6 ">Hey Rabbit 🖐️!</h2>
          <p className="text-center mb-6">Enter your username and password to Register</p>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-2 border rounded pr-12'
                placeholder='Enter your Password'
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 border border-gray-300 transition"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Password should be like <span className="font-mono">@Abc1234</span>
            </div>
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