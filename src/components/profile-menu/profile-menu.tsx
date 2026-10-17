import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { logout } from '../../services/slices/user-slice';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logout());
  };

  return <ProfileMenuUI pathname={location.pathname} handleLogout={handleLogout} />;
};
