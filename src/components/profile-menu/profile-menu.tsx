import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logout } from '../../services/slices/user-slice';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = (): void => {
    void dispatch(logout()).then(() => {
      void navigate('/login');
    });
  };

  return <ProfileMenuUI pathname={pathname} handleLogout={handleLogout} />;
};
