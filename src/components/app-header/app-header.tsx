import { AppHeaderUI } from '@ui';

import { userSelectors } from '../../services/slices/user-slice';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(userSelectors.selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
