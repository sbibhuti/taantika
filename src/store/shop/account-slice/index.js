import { API } from "@/api/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
};

export const userDetails = createAsyncThunk(
  "/account/userDetails",

  async (userId) => {
    const response = await API.get(`/shop/account/user/${userId}`, {
      withCredentials: true,
    });

    return response.data;
  },
);

export const updateUser = createAsyncThunk(
  "/account/user/update",

  async ({ userId, userFormData }) => {
    const response = await API.put(
      `/shop/account/user/update/${userId}`,
      userFormData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    return response.data;
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(userDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userDetails.fulfilled, (state, action) => {
        state.user = action.payload.success ? action.payload.user : null;
        state.isLoading = false;
      })
      .addCase(userDetails.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.success ? action.payload.user : null;
      })
      .addCase(updateUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { setUserDetails } = accountSlice.actions;
export default accountSlice.reducer;
