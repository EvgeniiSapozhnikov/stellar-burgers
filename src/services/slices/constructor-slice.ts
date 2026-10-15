import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorState, TConstructorIngredient, TIngredient } from '@utils-types';

import type { RootState } from '../store';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredient: TConstructorIngredient = {
        ...action.payload,
        id: nanoid(),
      };
      if (action.payload.type === 'bun') {
        state.bun = ingredient;
        return;
      }
      state.ingredients.push(ingredient);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return;
      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1],
      ];
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return;
      [state.ingredients[index + 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index + 1],
      ];
    },
    clearConstructor: () => initialState,
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} = constructorSlice.actions;

export const constructorSelectors = {
  selectConstructorState: (state: RootState): TConstructorState =>
    state.burgerConstructor,
};

export default constructorSlice.reducer;
