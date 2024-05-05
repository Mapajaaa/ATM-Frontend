import React, { useState, useEffect } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isCustAuthenticated, setIsCustAuthenticated] = useState(false);
  const [idU, setIdU] = useState({});
  const [idC, setIdC] = useState({});

  useEffect(() => {
    const userAuth = localStorage.getItem('isUserAuthenticated');
    const custAuth = localStorage.getItem('isCustAuthenticated');
    const userId = localStorage.getItem('idU');
    const custId = localStorage.getItem('idC');
    var dataU = JSON.parse(userId)
    var dataC = JSON.parse(custId)

    if (userAuth) {
      setIsUserAuthenticated(true);
    }
    if (custAuth) {
      setIsCustAuthenticated(true);
    }
    if (userId) {
      setIdU(dataU);
    }
    if (custId) {
      setIdC(dataC);
    }
  }, []);

  const loginU = () => {
    setIsUserAuthenticated(true);
    localStorage.setItem('isUserAuthenticated', true);
  };

  const logoutU = () => {
    setIsUserAuthenticated(false);
    setIdU(0);
    localStorage.removeItem('isUserAuthenticated');
    localStorage.removeItem('idU');
  };

  const loginC = () => {
    setIsCustAuthenticated(true);
    localStorage.setItem('isCustAuthenticated', true);
  };

  const logoutC = () => {
    setIsCustAuthenticated(false);
    setIdC(0);
    localStorage.removeItem('isCustAuthenticated');
    localStorage.removeItem('idC');
  };

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, isCustAuthenticated, loginU, logoutU, loginC, logoutC, idU, idC, setIdU, setIdC }}>
      {children}
    </AuthContext.Provider>
  );
};
