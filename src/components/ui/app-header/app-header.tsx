import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

const renderNavContent = (
  isActive: boolean,
  Icon: (props: { type: 'primary' | 'secondary' }) => React.JSX.Element,
  label: string
): React.JSX.Element => (
  <>
    <Icon type={isActive ? 'secondary' : 'primary'} />
    <p className="text text_type_main-default ml-2">{label}</p>
  </>
);

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to="/">
          {({ isActive }) => (
            <div
              className={
                isActive
                  ? `${styles.link} ${styles.link_active} mr-10`
                  : `${styles.link} mr-10`
              }
            >
              {renderNavContent(isActive, BurgerIcon, 'Конструктор')}
            </div>
          )}
        </NavLink>
        <NavLink to="/feed">
          {({ isActive }) => (
            <div
              className={isActive ? `${styles.link} ${styles.link_active}` : styles.link}
            >
              {renderNavContent(isActive, ListIcon, 'Лента заказов')}
            </div>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className="" />
      </div>
      <div className={styles.link_position_last}>
        <NavLink to="/profile">
          {({ isActive }) => (
            <div
              className={isActive ? `${styles.link} ${styles.link_active}` : styles.link}
            >
              {renderNavContent(isActive, ProfileIcon, userName ?? 'Личный кабинет')}
            </div>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
