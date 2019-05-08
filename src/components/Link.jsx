import React from 'react';
import { Link } from 'react-router-dom';

export default React.memo(function(props) {
  const { to = '', target = '', children } = props;
  const isExternal = to === '' || to.includes('http');

  // temporarily disable external links
  const style = { color: '#ccc' };
  console.log(style);

  return isExternal ? (
    <a target={target} style={{ color: 'inherit' }}>
      {children}
    </a>
  ) : (
    <Link to={to}>{children}</Link>
  );
});
