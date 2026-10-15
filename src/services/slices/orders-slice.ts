import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import type { TOrder } from '@utils-types';

import type { RootState } from '../store';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: unknown;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', getOrdersApi);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const ordersSelectors = {
  selectOrders: (state: RootState): TOrder[] => state.profileOrders.orders,
};

export default ordersSlice.reducer;
