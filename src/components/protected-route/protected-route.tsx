import { Navigate, useLocation } from 'react-router-dom';

import { userSelectors } from '../../services/slices/user-slice';
import { useSelector } from '../../services/store';

import type { ProtectedRouteProps } from './type';
import type { Location } from 'react-router-dom';

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(userSelectors.selectUser);
  const location = useLocation();

  if (!user && !onlyUnAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from ?? '/'} replace />;
  }

  return <>{children}</>;
};
