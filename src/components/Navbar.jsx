import React from 'react';
import { NavLink } from 'react-router-dom';
import { PiNotepadBold } from 'react-icons/pi';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const Navbar = () => {
  const { user, logout } = useCurrentUserContext();
  return (
    <nav className='bg-blue-600 text-white flex justify-between items-center sm:p-2 px-1 py-2'>
      <NavLink to='/'>
        <PiNotepadBold size={25} />
      </NavLink>

      {user ? (
        <NavLink
          onClick={() => {
            logout();
          }}
          className={`text-start text-base block px-2 sm:py-2 sm:px-3 rounded bg-red-500  text-white hover:bg-white hover:text-red-500`}
        >
          Logout
        </NavLink>
      ) : (
        <div className='flex'>
          <NavLink
            to='/login'
            className={({ isActive }) =>
              `text-start text-base block px-1 sm:py-2 sm:px-3 rounded ${
                isActive ? 'bg-white text-blue-500' : ''
              }`
            }
          >
            Login
          </NavLink>
          <NavLink
            to='/signup'
            className={({ isActive }) =>
              `text-start block px-2 sm:py-2 sm:px-3  rounded ${
                isActive ? 'bg-white text-blue-500' : ''
              }`
            }
          >
            Signup
          </NavLink>{' '}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
