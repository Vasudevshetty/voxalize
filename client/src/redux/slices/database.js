import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
});

// Async thunks
export const createDatabase = createAsyncThunk(
  "database/create",
  async (databaseData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/databases/create", databaseData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create database"
      );
    }
  }
);

export const getDatabases = createAsyncThunk(
  "database/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/databases");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch databases"
      );
    }
  }
);

export const getDatabaseById = createAsyncThunk(
  "database/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/databases/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch database"
      );
    }
  }
);

export const updateDatabase = createAsyncThunk(
  "database/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/v1/databases/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update database"
      );
    }
  }
);

export const deleteDatabase = createAsyncThunk(
  "database/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/databases/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete database"
      );
    }
  }
);

const databaseSlice = createSlice({
  name: "database",
  initialState: {
    databases: [],
    currentDatabase: null,
    loading: {
      create: false,
      fetch: false,
      update: false,
      delete: false,
    },
    error: {
      create: null,
      fetch: null,
      update: null,
      delete: null,
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.error = {
        create: null,
        fetch: null,
        update: null,
        delete: null,
      };
    },
    resetState: (state) => {
      state.databases = [];
      state.currentDatabase = null;
      state.loading = {
        create: false,
        fetch: false,
        update: false,
        delete: false,
      };
      state.error = {
        create: null,
        fetch: null,
        update: null,
        delete: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Database
      .addCase(createDatabase.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createDatabase.fulfilled, (state, action) => {
        state.loading.create = false;
        state.databases.push(action.payload);
      })
      .addCase(createDatabase.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      })

      // Get All Databases
      .addCase(getDatabases.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getDatabases.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.databases = action.payload;
      })
      .addCase(getDatabases.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })

      // Get Database by ID
      .addCase(getDatabaseById.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getDatabaseById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currentDatabase = action.payload;
      })
      .addCase(getDatabaseById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })

      // Update Database
      .addCase(updateDatabase.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateDatabase.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.databases.findIndex(
          (db) => db._id === action.payload._id
        );
        if (index !== -1) {
          state.databases[index] = action.payload;
        }
        if (state.currentDatabase?._id === action.payload._id) {
          state.currentDatabase = action.payload;
        }
      })
      .addCase(updateDatabase.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })

      // Delete Database
      .addCase(deleteDatabase.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteDatabase.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.databases = state.databases.filter(
          (db) => db._id !== action.payload
        );
        if (state.currentDatabase?._id === action.payload) {
          state.currentDatabase = null;
        }
      })
      .addCase(deleteDatabase.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });
  },
});

export const { clearErrors, resetState } = databaseSlice.actions;
export default databaseSlice.reducer;
