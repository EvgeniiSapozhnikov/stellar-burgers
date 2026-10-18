import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type TOrderInfoState = {
  orderData: TOrder | null;
  isOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  orderData: null,
  isOrderLoading: false,
  error: null,
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderInfo/fetchOrderByNumber',
  (number: number) => getOrderByNumberApi(number).then((res) => res.orders[0])
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderData = action.payload;
      });
  },
});

export const { clearOrderInfo } = orderInfoSlice.actions;

export const orderInfoSelectors = {
  selectOrderInfoState: (state: RootState): TOrderInfoState => state.orderInfo,
  selectOrderInfoData: (state: RootState): TOrder | null => state.orderInfo.orderData,
  selectIsOrderInfoLoading: (state: RootState): boolean =>
    state.orderInfo.isOrderLoading,
};

export default orderInfoSlice.reducer;
