import { configureStore } from "@reduxjs/toolkit";
import infoReducer from "./redux/infoSlice";

const store = configureStore({
  reducer: {
    public: infoReducer,
  },
});

export default store;
