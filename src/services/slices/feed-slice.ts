import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@api';
import type { TFeedState } from '@utils-types';

import type { RootState } from '../store';

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const feedSelectors = {
  selectFeedState: (state: RootState): TFeedState => state.feed,
  selectFeedOrders: (state: RootState) => state.feed.orders,
};

export default feedSlice.reducer;
