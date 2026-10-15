import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser, userSelectors } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const errorText = useSelector(userSelectors.selectError) ?? '';
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = (location.state as { from?: { pathname: string } } | null)?.from;
        void navigate(from?.pathname ?? '/');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
