import React from 'react'

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{ 
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture"}}>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: String(parseFloat(amount).toFixed(2)) // Ensure amount is a string with two decimal places
              }
            }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  )
}

export default PayPalButton