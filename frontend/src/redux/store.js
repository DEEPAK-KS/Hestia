import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import producrReducer from "./slice/productsSlice";
import cartReducer from "./slice/cartSlice";
import checkoutReducer from "./slice/checkoutSlice";
import orderReducer from "./slice/orderSlice";
import adminReducer from "./slice/adminSlice";
import adminproductReducer from "./slice/adminProductSlice";
import adminOrderReducer from "./slice/adminOrderSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: producrReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    admin: adminReducer,
    adminProducts: adminproductReducer,
    adminOrders: adminOrderReducer
  },
});

export default store;
