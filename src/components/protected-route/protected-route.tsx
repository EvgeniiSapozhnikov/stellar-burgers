import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { userSelectors } from '../../services/slices/user-slice';
import { useSelector } from '../../services/store';

import type { ProtectedRouteProps } from './type';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(userSelectors.selectIsAuthChecked);
  const user = useSelector(userSelectors.selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && onlyUnAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};
