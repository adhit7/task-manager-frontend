import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState } from 'react';
import api from '../lib/api';

const jwtToken = localStorage.getItem('userInfo');
const decodedUser = jwtToken ? jwtDecode(jwtToken).user : null;

const CurrentUserContext = createContext(null);

const CurrentUserProvider = ({ children }) => {
  const [user, setUser] = useState(decodedUser);
  const [editValues, setEditValues] = useState(null);

  const login = (token) => {
    localStorage.setItem('userInfo', token);
    const decodedToken = jwtDecode(token);
    const decodedUser = decodedToken.user;
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const googleLogin = async () => {
    window.location.href = 'http://localhost:4000/user/google/auth';
  };

  const updateTask = async (task) => {
    try {
      let { data, status } = await api.put('/task/update', {
        _id: task._id,
        ...task,
      });
      return { data, status };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.[0] ||
        error.response?.data?.message ||
        error.message;
      console.log(errorMessage);
    }
  };

  return (
    <CurrentUserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        googleLogin,
        updateTask,
        editValues,
        setEditValues,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

const useCurrentUserContext = () => useContext(CurrentUserContext);

export { useCurrentUserContext };
export default CurrentUserProvider;
