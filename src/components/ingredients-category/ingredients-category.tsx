import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import { constructorSelectors } from '../../services/slices/constructor-slice';
import { useSelector } from '../../services/store';

import type { TIngredientsCategoryProps } from './type';
import type { TConstructorState, TIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  /* Состояние конструктора из стора: счётчики должны показывать,
     сколько чего уже лежит в бургере */
  const burgerConstructor: TConstructorState = useSelector(
    constructorSelectors.selectConstructorState
  );

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: Record<string, number> = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    /* Булка в бургере физически одна, но используется дважды
       (сверху и снизу), поэтому считаем её как 2 */
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
