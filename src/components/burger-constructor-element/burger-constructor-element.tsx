import { BurgerConstructorElementUI } from '@ui';

import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
} from '../../services/slices/constructor-slice';
import { useDispatch } from '../../services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = ({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element => {
  const dispatch = useDispatch();

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={() => void dispatch(moveIngredientUp(index))}
      handleMoveDown={() => void dispatch(moveIngredientDown(index))}
      handleClose={() => void dispatch(removeIngredient(ingredient.id))}
    />
  );
};
