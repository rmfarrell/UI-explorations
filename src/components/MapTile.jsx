import React from 'react';
import styles from '../styles/Map.module.css';
import { NavLink } from 'react-router-dom';

export default function(props) {
  const {
    isLand = false,
    weight = 0,
    link = '',
    children,
    onClick = () => {},
    countryCode = ''
  } = props;
  if (!isLand) {
    return <div className={styles.sea} />;
  }
  if (!weight) {
    return <div className={styles.land}>{children}</div>;
  }
  const style = { backgroundColor: `hsl(3,${75 * (weight / 10)}%, 50%)` };

  return link ? withLink() : withCickHandler();

  function withCickHandler() {
    return (
      <button onClick={onClick} className={styles.eu} style={style}>
        {children}
      </button>
    );
  }

  function withLink() {
    return (
      <NavLink to={link} className={styles.eu} style={style}>
        {children}
      </NavLink>
    );
  }
}
