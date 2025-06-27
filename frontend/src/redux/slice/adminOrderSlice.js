import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Fetch all orders - Admin only
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_unused, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update order delivery status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Admin Order Slice
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is an array of orders
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        state.totalOrders = state.orders.length;
        state.totalSales = state.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
    
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const orderIndex = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
      })
      

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order._id !== action.payload);
        state.totalOrders -= 1;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminOrderSlice.reducer;
