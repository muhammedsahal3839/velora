
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// =========================
// LOGIN USER
// =========================

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.error ||
            data.detail ||
            "Invalid username or password."
        );
      }

      const token =
        data.token || data.access || data.access_token;

      if (!token) {
        return rejectWithValue(
          "Login succeeded, but token was not received."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", formData.username);

      window.dispatchEvent(new Event("authUpdated"));

      return {
        token,
        username: formData.username,
      };
    } catch (error) {
      console.error("Login error:", error);

      return rejectWithValue(
        "Unable to login. Please try again."
      );
    }
  }
);

// =========================
// REGISTER USER
// =========================

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.error ||
          data.detail ||
          data.username?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          "Unable to create account.";

        return rejectWithValue(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("Register error:", error);

      return rejectWithValue(
        "Unable to create account. Please try again."
      );
    }
  }
);

// =========================
// LOGOUT USER
// =========================

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    dispatch({ type: "cart/clearCart" });

    window.dispatchEvent(new Event("authUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    return null;
  }
);

// =========================
// AUTH SLICE
// =========================

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),

    loading: false,
    error: "",

    registerLoading: false,
    registerError: "",
    registerSuccess: false,
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = "";
    },

    clearRegisterStatus: (state) => {
      state.registerError = "";
      state.registerSuccess = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================
      // LOGIN
      // =========================

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to login.";
      })

      // =========================
      // REGISTER
      // =========================

      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = "";
        state.registerSuccess = false;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        state.registerSuccess = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError =
          action.payload || "Unable to create account.";
      })

      // =========================
      // LOGOUT
      // =========================

      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.username = null;
        state.loading = false;
        state.error = "";
        state.registerLoading = false;
        state.registerError = "";
        state.registerSuccess = false;
      });
  },
});

export const {
  clearAuthError,
  clearRegisterStatus,
} = authSlice.actions;

export default authSlice.reducer;
