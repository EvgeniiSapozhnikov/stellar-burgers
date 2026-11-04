import { describe, expect, it } from '@jest/globals';

import reducer, { fetchIngredients, initialState } from '../ingredients-slice';

import type { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://example.com/bun.png',
  image_mobile: 'https://example.com/bun-mobile.png',
  image_large: 'https://example.com/bun-large.png',
};

describe('Редьюсер слайса ингредиентов', () => {
  it('неизвестный экшен и undefined-состояние возвращают начальное состояние', () => {
    const initial = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initial).toEqual(initialState);
    expect(reducer(initial, { type: 'UNKNOWN_ACTION' })).toEqual(initial);
  });

  describe('fetchIngredients', () => {
    it('pending включает isLoading и сбрасывает ошибку', () => {
      const state = reducer(
        { ...initialState, error: { message: 'старая ошибка' } },
        { type: fetchIngredients.pending.type },
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected выключает isLoading и сохраняет ошибку', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        {
          type: fetchIngredients.rejected.type,
          error: { message: 'Ошибка сети' },
        },
      );

      expect(state.isLoading).toBe(false);
      expect(state.error?.message).toBe('Ошибка сети');
    });

    it('fulfilled кладёт массив ингредиентов в items и выключает isLoading', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        {
          type: fetchIngredients.fulfilled.type,
          payload: [ingredient],
        },
      );

      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual([ingredient]);
    });
  });
});
