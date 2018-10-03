import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../settings';
import logo from '../../image/sidebar.png';

export default ({ collapsed }) => {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div>
          <h3>
            <Link to="/dashboard">
              <i className={siteConfig.siteIcon} />
            </Link>
          </h3>
        </div>
      ) : (
          <h3>
            <Link to="/dashboard"><img style={{ width: '150px' }} src={logo} /></Link>
          </h3>
        )}
    </div>
  );
};
