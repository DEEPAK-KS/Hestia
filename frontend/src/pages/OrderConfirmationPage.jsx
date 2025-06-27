import { useEffect } from "react";
import OrderDetails from "./OrderDetails"
 
function OrderConfirmationPage({ order }) {
  
  useEffect(() => {
    // Check if the reload has already happened
    if (!localStorage.getItem("orderPageReloaded")) {
      localStorage.setItem("orderPageReloaded", "true");
      window.location.reload();
    }
  }, [])
  const orderId = localStorage.getItem("orderId");
  return (  
    <div className='max-w-4xl mx-auto p-6 bg-white'>
        <h1 className="text-4xl font-bold text-center text-emerald-400 mb-8">Thank you for your order</h1>
        <OrderDetails orderId={orderId} />
    </div>
  )
}

export default OrderConfirmationPage