import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
});

// Async thunks
export const createQueryMessage = createAsyncThunk(
  "queryMessage/create",
  async (
    { sessionId, databaseId, requestQuery, user },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/api/v1/messages", {
        sessionId,
        databaseId,
        requestQuery,
        user,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSessionMessages = createAsyncThunk(
  "queryMessage/getBySession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/messages/${sessionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const queryMessageSlice = createSlice({
  name: "queryMessage",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    currentMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.currentMessage = null;
    },
    setCurrentMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create message cases
      .addCase(createQueryMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQueryMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        state.currentMessage = action.payload;
      })
      .addCase(createQueryMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create message";
      })
      // Get session messages cases
      .addCase(getSessionMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessionMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getSessionMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch messages";
      });
  },
});

export const { clearMessages, setCurrentMessage } = queryMessageSlice.actions;
export default queryMessageSlice.reducer;
