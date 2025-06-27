import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch user orders
export const fetchUserOrder = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user orders" }
      );
    }
  }
);

// Async thunk to fetch details of a product by order ID
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      if (!orderId) {
        orderId = localStorage.getItem("orderId");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch order details" }
      );
    }
  }
);

// Orders slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUserOrder handlers
      .addCase(fetchUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrder.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.totalOrders = action.payload.length || 0;
        state.loading = false;
      })
      .addCase(fetchUserOrder.rejected, (state, action) => {
        state.error = action.payload?.message || "Unable to load orders";
        state.loading = false;
      })

      // fetchOrderDetails handlers
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.error = action.payload?.message || "Unable to load order details";
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
