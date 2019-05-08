import React from 'react';
import styles from '../styles/Map.module.css';
import { NavLink } from 'react-router-dom';

export default function(props) {
  const { data, linkPrefix } = props;
  if (!data) {
    return <div className={styles.sea} />;
  }
  const { weight, country } = data;
  if (!weight) {
    return (
      <div className={styles.land}>
        <span>{country}</span>
      </div>
    );
  }
  return (
    <NavLink
      to={`${linkPrefix}${country}`}
      className={styles.eu}
      style={{ backgroundColor: `hsl(3,${75 * (weight / 10)}%, 50%)` }}
    >
      <span>{country}</span>
    </NavLink>
  );
}
