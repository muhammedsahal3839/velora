
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// FETCH PRODUCTS FROM DJANGO API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(
      "https://velora-hjso.onrender.com/products/"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return Array.isArray(data)
      ? data
      : data.results || [];
  }
);

// PRODUCTS GLOBAL STATE
const productsSlice = createSlice({
  name: "products",

  initialState: {
    items: [],
    loading: false,
    error: "",
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Unable to load products.";
      });
  },
});

export default productsSlice.reducer;
