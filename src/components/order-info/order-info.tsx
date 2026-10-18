import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { ingredientsSelectors } from '../../services/slices/ingredients-slice';
import {
  fetchOrderByNumber,
  orderInfoSelectors,
} from '../../services/slices/order-info-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { RootState } from '../../services/store';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector(ingredientsSelectors.selectIngredients);
  const fetchedOrder = useSelector(orderInfoSelectors.selectOrderInfoData);
  const isOrderLoading = useSelector(orderInfoSelectors.selectIsOrderInfoLoading);

  const orders = useSelector((state: RootState) => [
    ...state.feed.orders,
    ...state.profileOrders.orders,
  ]);

  const localOrder = orders.find((order) => order.number === Number(number));
  const orderData = localOrder ?? fetchedOrder;

  useEffect(() => {
    if (!localOrder && !isOrderLoading) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [localOrder, isOrderLoading, number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
