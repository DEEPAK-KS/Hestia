import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("userToken");

// Async Thunk to fetch products by Collection and optional filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();

    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice !== undefined && minPrice !== "") query.append("minPrice", minPrice);
    if (maxPrice !== undefined && maxPrice !== "") query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);
  
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    // console.log(response.data)
    return response.data;
  }
);

// Fetch single product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  }
);

// Fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

// Create product slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    loadingDetails: false,
    errorDetails: null,
    updating: false,
    errorUpdate: null,
    updatedProduct: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",  // ✅ corrected
      collection: "",
      limit: "",      // ✅ added
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",   // ✅ corrected
        collection: "",
        limit: "",      // ✅ added
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProductsByFilters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchProductDetails
      .addCase(fetchProductDetails.pending, (state) => {
        state.loadingDetails = true;
        state.errorDetails = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.errorDetails = action.error.message;
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.updating = true;
        state.errorUpdate = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updating = false;
        state.updatedProduct = action.payload;

        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false;
        state.errorUpdate = action.error.message;
      })

      // fetchSimilarProducts
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
