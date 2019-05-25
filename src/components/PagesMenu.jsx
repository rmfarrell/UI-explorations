import React from 'react';
import styles from '../styles/Main.module.css';
import { NavLink } from 'react-router-dom';
import { i18n } from '../lib/helpers';

export default function(props) {
  const { activeClassName = 'active', className = '' } = props;
  return (
    <nav className={className}>
      <div>
        <h2>{i18n('footer', 'the_site')}</h2>
        <ul>
          <li>
            <NavLink to="/static1">{i18n('footer', 'about')}</NavLink>
          </li>
          <li>
            <NavLink to="/static1">{i18n('footer', 'guide')}</NavLink>
          </li>
          <li>
            <NavLink to="/static1">{i18n('footer', 'methodology')}</NavLink>
          </li>
          <li>
            <NavLink to="/static1">{i18n('footer', 'faqs')}</NavLink>
          </li>
        </ul>
      </div>
      <div>
        <h2>{i18n('footer', 'resources')}</h2>
        <ul>
          <li>
            <NavLink to="/static1">{i18n('footer', 'insights')}</NavLink>
          </li>
          <li>
            <NavLink to="/static1">{i18n('footer', 'thought_leaders')}</NavLink>
          </li>
          <li>
            <NavLink to="/static1">{i18n('footer', 'our_partners')}</NavLink>
          </li>
        </ul>
      </div>
      <div>
        <h2>{i18n('footer', 'connect')}</h2>
        <ul>
          <li>
            <NavLink to="/static1">{i18n('footer', 'news')}</NavLink>
          </li>
          <li>
            <NavLink to="/static1">{i18n('footer', 'contact')}</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
