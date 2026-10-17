import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const ingredientsSelectors = {
  selectIngredientsState: (state: RootState): TIngredientsState => state.ingredients,
  selectIngredients: (state: RootState): TIngredient[] => state.ingredients.items,
};

export default ingredientsSlice.reducer;
