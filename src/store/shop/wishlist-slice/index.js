import { API } from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  wishlist: [],
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
    total: 1,
  },
};

export const fetchAllWishlist = createAsyncThunk(
  "/wishlist",
  async ({ userId, page, limit }) => {
    const query = new URLSearchParams({
      userId,
      page,
      limit,
    });

    const result = await API.get(`/shop/wishlist/get?${query}`);

    return result?.data;
  },
);

export const wishlistAdd = createAsyncThunk(
  "/wishlist/add",
  async ({ userId, productId }) => {
    const result = await API.post("/shop/wishlist/add", {
      userId,
      productId,
    });

    return result?.data;
  },
);

export const wishlistRemove = createAsyncThunk(
  "wishlist/remove",
  async ({ userId, productId }) => {
    const response = await API.patch("/shop/wishlist/remove", {
      userId,
      productId,
    });

    return response.data;
  },
);

export const clearWislist = createAsyncThunk(
  "wishlist/clear",
  async ({ userId }) => {
    const response = await API.delete(`shop/wishlist/delete/${userId}`);

    return response.data;
  },
);

const productWishlistSlice = createSlice({
  name: "productWishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    setRemoveWishlist: (state, action) => {
      const { productId } = action.payload;
      const product = state.wishlist.filter((p) => p._id !== productId);
      state.wishlist = product;
    },
    resetWishlist: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWishlist.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.wishlist = [];
      })
      .addCase(wishlistAdd.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(wishlistAdd.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(wishlistAdd.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(clearWislist.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(clearWislist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = [];
      })
      .addCase(clearWislist.rejected, (state, action) => {
        state.isLoading = false;
        state.wishlist = null;
      });
  },
});

export const { setWishlist, setRemoveWishlist, resetWishlist } =
  productWishlistSlice.actions;

export default productWishlistSlice.reducer;
