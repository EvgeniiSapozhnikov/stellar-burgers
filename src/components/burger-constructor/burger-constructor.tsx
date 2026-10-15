import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearConstructor, constructorSelectors } from '../../services/slices/constructor-slice';
import { clearOrder, orderBurger, orderSelectors } from '../../services/slices/order-slice';
import { userSelectors } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(constructorSelectors.selectConstructorState);
  const { orderRequest, orderModalData } = useSelector(orderSelectors.selectOrderState);
  const user = useSelector(userSelectors.selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login');
      return;
    }
    void dispatch(
      orderBurger([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item: TConstructorIngredient) => item._id),
      ])
    );
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
