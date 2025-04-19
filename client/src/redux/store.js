import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import databaseReducer from "./slices/database";
import querySessionReducer from "./slices/querySession";

const store = configureStore({
  reducer: {
    user: userReducer,
    database: databaseReducer,
    querySession: querySessionReducer,
  },
});

export default store;
