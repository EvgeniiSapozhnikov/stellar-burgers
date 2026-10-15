import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';

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

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from;
    return <Navigate to={from?.pathname ?? '/'} replace />;
  }

  return <>{children}</>;
};
