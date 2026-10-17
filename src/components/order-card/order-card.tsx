import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ingredientsSelectors } from '../../services/slices/ingredients-slice';
import { useSelector } from '../../services/store';
import { OrderCardUI } from '../ui/order-card';

import type { OrderCardProps } from './type';
import type { TIngredient } from '@utils-types';
import type { FC } from 'react';
import type { Location } from 'react-router-dom';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  const { items: ingredients } = useSelector(
    ingredientsSelectors.selectIngredientsState
  );

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce<TIngredient[]>((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      return ingredient ? [...acc, ingredient] : acc;
    }, []);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - ingredientsToShow.length
        : 0;

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date,
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{
        background: location.state
          ? (location.state as { background: Location }).background
          : ({} as Location),
      }}
    />
  );
});

OrderCard.displayName = 'OrderCard';
