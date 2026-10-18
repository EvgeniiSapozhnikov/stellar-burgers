import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo, useRef } from 'react';
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

  const feedOrders = useSelector((state: RootState) => state.feed.orders);
  const profileOrders = useSelector((state: RootState) => state.profileOrders.orders);

  const orders = useMemo(
    () => [...feedOrders, ...profileOrders],
    [feedOrders, profileOrders]
  );

  const numberFromUrl = Number(number);

  const localOrder = orders.find((order) => order.number === numberFromUrl);

  const fetchedOrderMatches =
    fetchedOrder && fetchedOrder.number === numberFromUrl ? fetchedOrder : null;

  const orderData = localOrder ?? fetchedOrderMatches;

  const requestedNumberRef = useRef<number | null>(null);

  useEffect(() => {
    if (localOrder || requestedNumberRef.current === numberFromUrl) {
      return;
    }
    requestedNumberRef.current = numberFromUrl;
    void dispatch(fetchOrderByNumber(numberFromUrl));
  }, [localOrder, numberFromUrl, dispatch]);

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
