import React from 'react';
import { Link } from 'react-router-dom';

export default React.memo(function(props) {
  const { to = '', target = '', children } = props;
  const isExternal = to === '#' || to.includes('http');
  return isExternal ? (
    <a href={to} target={target}>
      {children}
    </a>
  ) : (
    <Link to={to}>{children}</Link>
  );
});
