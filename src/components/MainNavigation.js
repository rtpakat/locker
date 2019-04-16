import React from 'react';
import { NavLink } from 'react-router-dom';

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>Lockers</h1>
    </div>
    <nav className="main-navigation__items">
    <li>
          <NavLink to="/auth">Authenticate</NavLink>
    </li>
    </nav>
  </header>
);

export default mainNavigation;