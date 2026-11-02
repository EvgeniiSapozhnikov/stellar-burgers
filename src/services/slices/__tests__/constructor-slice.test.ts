import { describe, expect, it } from '@jest/globals';

import reducer, {
  addIngredient,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  resetConstructor,
} from '../constructor-slice';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

const makeIngredient = (
  _id: string,
  name: string,
  type: TIngredient['type'],
): TConstructorIngredient => ({
  _id,
  name,
  type,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: '',
  id: _id,
});

const bun = makeIngredient('bun-1', 'Флюоресцентная булка R2-D3', 'bun');
const first = makeIngredient('main-1', 'Говяжий метеорит (отбивная)', 'main');
const second = makeIngredient('main-2', 'Соус Spicy-X', 'sauce');

const emptyState = (): ReturnType<typeof reducer> =>
  reducer(undefined, { type: 'UNKNOWN_ACTION' });

describe('Редьюсер конструктора бургера', () => {
  it('неизвестный экшен и undefined-состояние возвращают начальное состояние', () => {
    const initial = emptyState();

    expect(initial.bun).toBeNull();
    expect(initial.ingredients).toEqual([]);
    expect(reducer(initial, { type: 'UNKNOWN_ACTION' })).toEqual(initial);
  });

  it('addIngredient сохраняет булку в bun, не добавляя её в ingredients', () => {
    const state = reducer(emptyState(), addIngredient(bun));

    expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
    expect(state.ingredients).toHaveLength(0);
  });

  it('addIngredient добавляет начинку в ingredients', () => {
    const state = reducer(emptyState(), addIngredient(first));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...first, id: expect.any(String) }]);
  });

  it('addIngredient сохраняет несколько начинок в порядке добавления', () => {
    let state = emptyState();
    state = reducer(state, addIngredient(first));
    state = reducer(state, addIngredient(second));

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-1', 'main-2']);
  });

  it('addIngredient перезаписывает id на сгенерированный nanoid', () => {
    const state = reducer(emptyState(), addIngredient(first));

    expect(state.ingredients[0].id).not.toBe(first.id);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  it('removeIngredient удаляет начинку по id', () => {
    let state = emptyState();
    state = reducer(state, addIngredient(first));
    state = reducer(state, addIngredient(second));

    /* Достаём фактический id первого элемента — prepare перезаписал его nanoid'ом */
    const firstId = state.ingredients[0].id;
    state = reducer(state, removeIngredient(firstId));

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-2']);
  });

  it('moveIngredientUp поднимает начинку выше', () => {
    let state = emptyState();
    state = reducer(state, addIngredient(first));
    state = reducer(state, addIngredient(second));
    state = reducer(state, moveIngredientUp(1));

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-2', 'main-1']);
  });

  it('moveIngredientDown опускает начинку ниже', () => {
    let state = emptyState();
    state = reducer(state, addIngredient(first));
    state = reducer(state, addIngredient(second));
    state = reducer(state, moveIngredientDown(0));

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-2', 'main-1']);
  });

  it('moveIngredientUp на первом элементе не меняет порядок', () => {
    let state = emptyState();
    state = reducer(state, addIngredient(first));
    state = reducer(state, addIngredient(second));
    state = reducer(state, moveIngredientUp(0));

    expect(state.ingredients.map((item) => item._id)).toEqual(['main-1', 'main-2']);
  });

  it('resetConstructor очищает конструктор полностью', () => {
    let state = emptyState();
    state = reducer(state, addIngredient(bun));
    state = reducer(state, addIngredient(first));
    state = reducer(state, resetConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
