import { BurgerConstructorUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  constructorSelectors,
  resetConstructor,
} from '../../services/slices/constructor-slice';
import {
  clearOrder,
  orderBurger,
  orderSelectors,
} from '../../services/slices/order-slice';
import { userSelectors } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, ingredients } = useSelector(constructorSelectors.selectConstructorState);
  const { orderRequest, orderModalData } = useSelector(orderSelectors.selectOrderState);
  const user = useSelector(userSelectors.selectUser);
  const isAuthChecked = useSelector(userSelectors.selectIsAuthChecked);

  useEffect(() => {
    if (orderModalData) {
      void dispatch(resetConstructor());
    }
  }, [orderModalData, dispatch]);

  const constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  } = { bun, ingredients };

  const onOrderClick = (): void => {
    if (isAuthChecked && !user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (orderRequest) {
      return;
    }
    if (!bun || ingredients.length === 0) {
      return;
    }
    const ingredientIds: string[] = [
      bun._id,
      bun._id,
      ...ingredients.map((item) => item._id),
    ];
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
