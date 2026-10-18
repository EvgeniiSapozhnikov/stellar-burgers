import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

const renderIcon = (
  isActive: boolean,
  Icon: (props: { type: 'primary' | 'secondary' }) => React.JSX.Element
): React.JSX.Element => <Icon type={isActive ? 'primary' : 'secondary'} />;

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.link} mr-10 ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {renderIcon(isActive, BurgerIcon)}
              <p className="text text_type_main-default ml-2">Конструктор</p>
            </>
          )}
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {renderIcon(isActive, ListIcon)}
              <p className="text text_type_main-default ml-2">Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className="" />
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              {renderIcon(isActive, ProfileIcon)}
              <p className="text text_type_main-default ml-2">
                {userName ?? 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
