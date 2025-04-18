import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
});

// Async thunks
export const getProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/users/me");
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      // Using FormData to handle file uploads
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const res = await api.put("/api/v1/users/profile", formData, config);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await api.put("/api/v1/users/password", {
        oldPassword,
        newPassword,
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: {
      profile: false,
      update: false,
      password: false,
    },
    error: {
      profile: null,
      update: null,
      password: null,
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.error = {
        profile: null,
        update: null,
        password: null,
      };
    },
    resetProfile: (state) => {
      state.profile = null;
      state.loading = {
        profile: false,
        update: false,
        password: false,
      };
      state.error = {
        profile: null,
        update: null,
        password: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
        state.error.profile = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.profile = null; // Clear profile on rejection
        state.error.profile = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.update = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading.password = true;
        state.error.password = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading.password = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading.password = false;
        state.error.password = action.payload;
      });
  },
});

export const { clearErrors, resetProfile } = userSlice.actions;
export default userSlice.reducer;
