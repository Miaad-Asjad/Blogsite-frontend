import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";


export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    console.log("Attempting to logout...");
    const response = await axiosInstance.post("/api/auth/logout");
    console.log("Logout successful:", response.data);
    
   
    localStorage.removeItem("userData");
    return response.data;
  } catch (err) {
    console.error("Logout failed:", err);
    return rejectWithValue(err.response?.data || "Logout failed");
  }
});


const getStoredUserData = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("userData"));
    if (stored?.accessToken && stored.user) {
      return {
        user: stored.user,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken || null,
        isAuthenticated: true,
      };
    }
  } catch (e) {
    console.error("Error reading userData from localStorage:", e);
  }
  return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
};




// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: getStoredUserData(),
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem(
        "userData",
        JSON.stringify({ user, accessToken, refreshToken })
      );
    },

    updateUserToken: (state, action) => {
      state.accessToken = action.payload.accessToken;

      localStorage.setItem(
        "userData",
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        })
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userData");
    });
  },
});

export const { loginSuccess, updateUserToken } = authSlice.actions;
export default authSlice.reducer;
