import { ProfileUI } from '@ui-pages';
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';

import { updateUser, userSelectors } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.selectUser);
  const updateUserError = useSelector(userSelectors.selectUpdateUserError) ?? '';

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  const initialUser = useMemo(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    }),
    [user?.name, user?.email]
  );

  useEffect(() => {
    setFormValue(initialUser);
  }, [initialUser]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== initialUser.name ||
      formValue.email !== initialUser.email ||
      formValue.password !== '',
    [formValue, initialUser]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleCancel = (): void => {
    setFormValue(initialUser);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    void dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password !== '' ? { password: formValue.password } : {}),
      })
    );
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
};
