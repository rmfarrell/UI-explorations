import React from 'react';
import styles from '../styles/Map.module.css';
import { NavLink } from 'react-router-dom';

export default function(props) {
  const { country = '', weight = 0, link = '', children } = props;
  if (!country) {
    return <div className={styles.sea} />;
  }
  if (!weight) {
    return (
      <div className={styles.land}>
        <span>{country}</span>
      </div>
    );
  }
  return (
    <NavLink
      to={link}
      className={styles.eu}
      style={{ backgroundColor: `hsl(3,${75 * (weight / 10)}%, 50%)` }}
    >
      <span>{country}</span>
    </NavLink>
  );
}
