import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// Async thunk to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData) => {
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// Async thunk to update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return response.data;
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
      headers: {
        Authorization: USER_TOKEN,
      },
    });
    return id;
  }
);

// Redux Slice
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH PRODUCTS
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CREATE PRODUCT
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // UPDATE PRODUCT
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminProductSlice.reducer;
