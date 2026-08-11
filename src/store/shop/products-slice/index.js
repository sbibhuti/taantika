import { API } from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page, limit }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page,
      limit,
    });

    const result = await API.get(`/shop/products/get?${query}`);

    return result?.data;
  },
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await API.get(`/shop/products/get/${id}`);

    return result?.data;
  },
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    resetProductList: (state) => {
      state.productList = [];
    },
    setProductWishlist: (state, action) => {
      const { productId } = action.payload;
      const product = state.productList.find((p) => p._id === productId);
      if (product) {
        product.wishlist = !product.wishlist;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, resetProductList, setProductWishlist } =
  shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
