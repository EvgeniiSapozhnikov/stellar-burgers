import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '@api';
import type { TOrder } from '@utils-types';

import type { RootState } from '../store';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null,
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (data: string[], { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(data);
      return res.order;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = (action.payload as string) ?? action.error.message ?? null;
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const orderSelectors = {
  selectOrderState: (state: RootState): TOrderState => state.order,
};

export default orderSlice.reducer;
