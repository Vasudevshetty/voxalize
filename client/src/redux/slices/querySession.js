import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
});

// Async thunks
export const createQuerySession = createAsyncThunk(
  "querySession/create",
  async (sessionData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/sessions", sessionData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create session"
      );
    }
  }
);

export const getQuerySessions = createAsyncThunk(
  "querySession/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/sessions");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sessions"
      );
    }
  }
);

export const getQuerySessionById = createAsyncThunk(
  "querySession/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/sessions/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch session"
      );
    }
  }
);

const querySessionSlice = createSlice({
  name: "querySession",
  initialState: {
    sessions: [],
    currentSession: null,
    loading: {
      create: false,
      fetch: false,
      fetchOne: false,
    },
    error: {
      create: null,
      fetch: null,
      fetchOne: null,
    },
  },
  reducers: {
    clearErrors: (state) => {
      state.error = {
        create: null,
        fetch: null,
        fetchOne: null,
      };
    },
    resetState: (state) => {
      state.sessions = [];
      state.currentSession = null;
      state.loading = {
        create: false,
        fetch: false,
        fetchOne: false,
      };
      state.error = {
        create: null,
        fetch: null,
        fetchOne: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Query Session
      .addCase(createQuerySession.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createQuerySession.fulfilled, (state, action) => {
        state.loading.create = false;
        state.sessions.push(action.payload);
        state.currentSession = action.payload;
      })
      .addCase(createQuerySession.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      })

      // Get All Query Sessions
      .addCase(getQuerySessions.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(getQuerySessions.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.sessions = action.payload;
      })
      .addCase(getQuerySessions.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })

      // Get Query Session by ID
      .addCase(getQuerySessionById.pending, (state) => {
        state.loading.fetchOne = true;
        state.error.fetchOne = null;
      })
      .addCase(getQuerySessionById.fulfilled, (state, action) => {
        state.loading.fetchOne = false;
        state.currentSession = action.payload;
      })
      .addCase(getQuerySessionById.rejected, (state, action) => {
        state.loading.fetchOne = false;
        state.error.fetchOne = action.payload;
      });
  },
});

export const { clearErrors, resetState } = querySessionSlice.actions;
export default querySessionSlice.reducer;
