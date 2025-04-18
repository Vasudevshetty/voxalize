import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import databaseReducer from "./slices/database";

const store = configureStore({
  reducer: {
    user: userReducer,
    database: databaseReducer,
  },
});

export default store;
