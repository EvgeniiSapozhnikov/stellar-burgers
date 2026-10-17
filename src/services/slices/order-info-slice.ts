import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi } from '../../utils/burger-api';

import type { TOrder } from '@utils-types';

export const getOrderByNumber = createAsyncThunk(
  'orderInfo/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);

    if (!data.success || !data.orders.length) {
      throw new Error(`Заказ №${number} не найден`);
    }

    return data.orders[0];
  }
);

type TOrderInfoState = {
  order: TOrder | null;
  request: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  request: false,
  error: null,
};

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.request = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
        state.request = false;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
  selectors: {
    selectOrderInfo: (state) => state,
  },
});

export const { clearOrderInfo } = orderInfoSlice.actions;
export const orderInfoSelectors = orderInfoSlice.selectors;
