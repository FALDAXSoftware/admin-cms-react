import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../image/sidebar.png';
import siteLogo from '../../image/white_logo.png'

export default ({ collapsed }) => {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div>
          <h3>
            <Link to="/dashboard">
              <img style={{ width: '50px' }} alt="site-logo" src={siteLogo} />
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
