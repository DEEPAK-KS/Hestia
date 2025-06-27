import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createCheckout } from '../../redux/slice/checkoutSlice'; 



const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [checkoutId, setCheckoutId] = useState(null);
    const [creatingCheckout, setCreatingCheckout] = useState(false);
    // Shipping address state
    const [shippingAddress, setShippingAddress] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postalCode: ''
    });

    // Ensure cart is loaded before proceeding
    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/");
        }
    }, [cart, navigate]);

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (cart && cart.products.length > 0) {
            const res = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "Paypal",
                    totalPrice: cart.totalPrice,
                })
            );
            if (res.payload && res.payload._id) {
                setCheckoutId(res.payload._id); // set checkout ID after successful checkout creation
            }
        }
    };

    const handlePaymentSuccess = async (data) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                {
                    paymentStatus: "paid",
                    // paymentDetails: data,
                    paymentDetails:{
                        transactionId : "tnx_temp_123",
                        paymentGateway: "PayPal",
                        amount : cart.totalPrice,
                        currency: "USD"
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
                await handleFinalizeCheckout(checkoutId); // Finalize the checkout after payment success   
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            localStorage.setItem('orderId', response.data._id); //set order ID in local storage for order confirmation page
            localStorage.removeItem('cart'); // clear cart from local storage
            localStorage.removeItem('orderPageReloaded'); // clear order page reload flag
            navigate(`/order-confirmation`);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <p>Loading cart...</p>;
    }
    if (error) {
        return <p>Error loading cart: {error}</p>;
    }
    if (!cart || !cart.products || cart.products.length === 0) {
        return <p>Your cart is empty. Please add items to your cart before checking out.</p>;
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 px-6 max-w-7xl mx-auto tracking-tightest'>
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6 ">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700 ">Email</label>
                        <input
                            type="email"
                            value={user ? user.email : ""}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            disabled
                        />
                    </div>
                    <h3 className="text-lg mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstname}
                                onChange={e =>
                                    setShippingAddress({ ...shippingAddress, firstname: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastname}
                                onChange={e =>
                                    setShippingAddress({ ...shippingAddress, lastname: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Phone</label>
                            <input
                                type="tel"
                                value={shippingAddress.phone}
                                onChange={e =>
                                    setShippingAddress({ ...shippingAddress, phone: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Zip Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={e =>
                                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={e =>
                                setShippingAddress({ ...shippingAddress, address: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={e =>
                                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Country</label>
                            <input
                                type="text"
                                value={shippingAddress.country}
                                onChange={e =>
                                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    {/* <div className="mt-6">
                        {!checkoutId ? (
                            <button type="submit" className="w-full bg-black text-white py-3 rounded" >Check-Out</button>
                        ) : (
                            // <div>
                            //     <h3 className="text-lg mb-4">Pay with Paypal</h3>
                            //     {/* Paypal button component */}
                            {/*         <PayPalButton amount={cart.totalPrice} onClick={handlePaymentSuccess} onError={() => alert("Payment Failed. Try again .")} /> */}
                             {/* </div> */}
                        {/* )} */}
                    {/* </div> */} 
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded"
                        onClick={() => handlePaymentSuccess({ bypass: true })}>
                        Bypass Payment
                    </button>
                </form>
            </div>
            {/* Right Section */}
            <div className="bg-gray-50 p-6 rounded-lg ">
                <h3 className="text-lg mb-4 border-b border-gray-300">
                    Order Summary
                </h3>
                <div className="py-4 mb-4">
                    {cart.products.map((product) => (
                        <div key={product._id} className="flex items-start justify-between py-2 border-b border-gray-300">
                            <div className="flex items-start">
                                {product.image  ? (
                                    <img src={product.image} alt={product.image || product.name} className="w-20 h-20 object-cover mr-4" />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 flex items-center justify-center mr-4">
                                        <span className="text-gray-400 text-xs">No Image</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-md font-semibold">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-xl">${product.price.toLocaleString()}</p>
                        </div>
                    ))}
                    <div className="flex justify-between mt-2">
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>
                </div>
                <div className="flex justify-between items-center text-lg mt-4 border-t border-gray-300 pt-4">
                    <p>Total</p>
                    <p>${cart.totalPrice}</p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
