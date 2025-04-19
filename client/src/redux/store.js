import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import databaseReducer from "./slices/database";
import querySessionReducer from "./slices/querySession";
import queryMessageReducer from "./slices/queryMessage";

const store = configureStore({
  reducer: {
    user: userReducer,
    database: databaseReducer,
    querySession: querySessionReducer,
    queryMessage: queryMessageReducer,
  },
});

export default store;
