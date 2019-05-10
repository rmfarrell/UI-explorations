import React from 'react';
import { Link } from 'react-router-dom';

export default React.memo(function(props) {
  const { to = '', target = '', children } = props;
  const isExternal = to === '' || to.includes('http');
  const isAnchor = to.match(/^#/);

  return isExternal || isAnchor ? (
    <a target={target} style={{ color: 'inherit' }} href={to}>
      {children}
    </a>
  ) : (
    <Link to={to}>{children}</Link>
  );
});
