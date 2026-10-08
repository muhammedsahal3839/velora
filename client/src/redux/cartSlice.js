
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://velora-hjso.onrender.com";

const getHeaders = (includeContentType = false) => {
  const token = localStorage.getItem("token");

  return {
    ...(includeContentType
      ? { "Content-Type": "application/json" }
      : {}),
    Authorization: `Bearer ${token}`,
  };
};

// FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/cart/my-cart/`, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          message: data.error || "Unable to load cart.",
          status: response.status,
        });
      }

      return data;
    } catch {
      return rejectWithValue({
        message: "Unable to load cart.",
      });
    }
  }
);

// UPDATE QUANTITY
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/cart/update/${itemId}/`,
        {
          method: "PATCH",
          headers: getHeaders(true),
          body: JSON.stringify({ quantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          message: data.error || "Unable to update quantity.",
          status: response.status,
        });
      }

      window.dispatchEvent(new Event("cartUpdated"));

      return data.cart;
    } catch {
      return rejectWithValue({
        message: "Unable to update quantity.",
      });
    }
  }
);

// REMOVE ITEM
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/cart/remove/${itemId}/`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        return rejectWithValue({
          message: "Unable to remove item.",
          status: response.status,
        });
      }

      const refreshedCart = await dispatch(fetchCart()).unwrap();

      window.dispatchEvent(new Event("cartUpdated"));

      return refreshedCart;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Unable to remove item.",
        status: error?.status,
      });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cart: null,
    loading: false,
    updatingItem: null,
    error: "",
    authStatus: null,
  },

  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.error = "";
      state.authStatus = null;
      state.updatingItem = null;
      state.loading = false;
    },
    clearCartError: (state) => {
      state.error = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.authStatus = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Unable to load cart.";
        state.authStatus = action.payload?.status || null;
      })

      // UPDATE QUANTITY
      .addCase(updateCartQuantity.pending, (state, action) => {
        state.updatingItem = action.meta.arg.itemId;
        state.error = "";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.updatingItem = null;
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.updatingItem = null;
        state.error =
          action.payload?.message || "Unable to update quantity.";
      })

      // REMOVE
      .addCase(removeCartItem.pending, (state, action) => {
        state.updatingItem = action.meta.arg;
        state.error = "";
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.updatingItem = null;
        state.cart = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.updatingItem = null;
        state.error =
          action.payload?.message || "Unable to remove item.";
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
