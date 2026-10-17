import { BurgerConstructorUI } from '@ui';
import { useEffect, useMemo } from 'react';

import {
  constructorSelectors,
  resetConstructor,
} from '../../services/slices/constructor-slice';
import {
  clearOrder,
  orderBurger,
  orderSelectors,
} from '../../services/slices/order-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector(constructorSelectors.selectConstructorState);
  const { orderRequest, orderModalData } = useSelector(orderSelectors.selectOrderState);

  useEffect(() => {
    if (orderModalData) {
      dispatch(resetConstructor());
    }
  }, [orderModalData, dispatch]);

  const constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  } = { bun, ingredients };

  const onOrderClick = (): void => {
    if (!bun || ingredients.length === 0) {
      return;
    }
    /* Булка отправляется один раз — сервер дублирует её сам */
    const ingredientIds: string[] = [bun._id, ...ingredients.map((item) => item._id)];
    void dispatch(orderBurger(ingredientIds));
  };

  const handleOrderClose = (): void => {
    dispatch(clearOrder());
  };

  const price: number = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((acc: number, item) => acc + item.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      constructorItems={constructorItems}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleOrderClose}
      price={price}
    />
  );
};
