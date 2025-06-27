import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all the users
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return response.data;
});

// create user
export const addUser = createAsyncThunk(
  'admin/addUser',
  async (userData, { rejectWithValue }) => {
    console.log("User Data:", userData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
        }
      );
      return response.data;
    } catch (error) {
      // Improved error handling
      return rejectWithValue(
        error.response?.data || error.message || "Unknown error"
      );
    }
  }
);

// update user info
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// delete a user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (id) => {
  await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    }
  );
  return id;
});

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // createUser
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false; 
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to update user";
      })

      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete user";
      });
  },
});

export default adminSlice.reducer;

