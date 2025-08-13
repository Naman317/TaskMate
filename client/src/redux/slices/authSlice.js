// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userFromStorage || null,
  isSidebarOpen: false,
  rehydrationComplete: false, // ✅ new flag
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.rehydrationComplete = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.rehydrationComplete = true;
      localStorage.removeItem("user");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    markRehydrated: (state) => {
      state.rehydrationComplete = true;
    },
  },
});

export const { setUser, logoutUser, setOpenSidebar, markRehydrated } = authSlice.actions;
export default authSlice.reducer;
