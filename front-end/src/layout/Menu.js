import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';


/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

const Menu = () => {
  const [makeSidebar, setMakeSidebar] = useState(false);

  const showSidebar = () => setMakeSidebar(!makeSidebar);

  return (
    <Fragment>
      <div className='navbar'>
        <Link to='#' className='menu-bars'>
          {/* <FaIcons.FaBars onClick={showSidebar} id='hamMenu' /> */}
        </Link>
      </div>
      <nav className={makeSidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
            <Link to='#' className='menu-bars'>
              {/* <AiIcons.AiOutlineClose /> */}
            </Link>
          </li>
          <Link
            className='navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0 mb-3'
            to='/'
          >
            <div className='mx-3'>
              <div className='text-center my-3 mx-0'>
              </div>{' '}
              <span>Periodic Tables</span>
            </div>
          </Link>

          <li className='nav-text'>
            <Link className='nav-link' to='/dashboard'>
              <span className='oi oi-dashboard' />
              &nbsp;Dashboard
            </Link>
          </li>
          <li className='nav-text'>
            <Link className='nav-link' to='/search'>
              <span className='oi oi-magnifying-glass' />
              &nbsp;Search
            </Link>
          </li>
          <li className='nav-text'>
            <Link className='nav-link' to='/reservations/new'>
              <span className='oi oi-plus' />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className='nav-text'>
            <Link className='nav-link' to='/tables/new'>
              <span className='oi oi-layers' />
              &nbsp;New Table
            </Link>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default Menu;