import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchOrders, ordersSelectors } from '../../services/slices/orders-slice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(ordersSelectors.selectOrders);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};

