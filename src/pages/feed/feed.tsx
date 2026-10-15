import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { feedSelectors, fetchFeeds } from '../../services/slices/feed-slice';
import { useDispatch, useSelector } from '../../services/store';

import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(feedSelectors.selectFeedOrders);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
