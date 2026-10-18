import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import { constructorSelectors } from '../../services/slices/constructor-slice';
import { useSelector } from '../../services/store';

import type { TIngredientsCategoryProps } from './type';
import type { TConstructorIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const bun = useSelector(constructorSelectors.selectBun);
  const constructorIngredients = useSelector(constructorSelectors.selectIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    constructorIngredients.forEach((ingredient: TConstructorIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    /* Булка в бургере физически одна, но используется дважды
       (сверху и снизу), поэтому считаем её как 2 */
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, constructorIngredients]);

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
