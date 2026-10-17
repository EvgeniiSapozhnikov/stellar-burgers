import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

export const CONSTRUCTOR_PERSIST_KEY = 'burgerConstructor';

const loadInitialState = (): TConstructorState => {
  try {
    const saved = localStorage.getItem(CONSTRUCTOR_PERSIST_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as TConstructorState;
      return {
        bun: parsed.bun ?? null,
        ingredients: parsed.ingredients ?? [],
      };
    }
  } catch {
    // некорректный JSON в localStorage — начинаем с пустого конструктора
  }
  return { bun: null, ingredients: [] };
};

const initialState: TConstructorState = loadInitialState();

const saveToStorage = (state: TConstructorState): void => {
  try {
    localStorage.setItem(
      CONSTRUCTOR_PERSIST_KEY,
      JSON.stringify({ bun: state.bun, ingredients: state.ingredients })
    );
  } catch {
    // localStorage недоступен — работаем без персистенса
  }
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
        saveToStorage(state);
      },
      prepare: (ingredient: TIngredient): { payload: TConstructorIngredient } => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
      saveToStorage(state);
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0 && index < state.ingredients.length) {
        const temp = state.ingredients[index - 1];
        state.ingredients[index - 1] = state.ingredients[index];
        state.ingredients[index] = temp;
        saveToStorage(state);
      }
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.ingredients.length - 1) {
        const temp = state.ingredients[index + 1];
        state.ingredients[index + 1] = state.ingredients[index];
        state.ingredients[index] = temp;
        saveToStorage(state);
      }
    },

    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      saveToStorage(state);
    },
  },
  selectors: {
    selectConstructorState: (state): TConstructorState => ({
      bun: state.bun,
      ingredients: state.ingredients,
    }),
    selectBun: (state) => state.bun,
    selectIngredients: (state) => state.ingredients,
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor,
} = burgerConstructorSlice.actions;

export const constructorSelectors = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
