// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: userFromStorage || null,
  isSidebarOpen: false,
  rehydrationComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload?.user ? action.payload : { user: action.payload, token: action.payload?.token };
      console.log(`setUser: Saving token to localStorage: ${!!token}`);
      state.user = user;
      state.rehydrationComplete = true;
      if (token) {
        localStorage.setItem("token", token);
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.rehydrationComplete = true;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
