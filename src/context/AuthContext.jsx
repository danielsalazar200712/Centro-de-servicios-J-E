import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('centro_je_user_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_USERS[0]; // Juan Fernando Posada Ramírez (Administrador 1) por defecto
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('centro_je_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('centro_je_user_v3');
    }
  }, [currentUser]);

  const login = (role = 'Administrador', email = '', nombre = '', userId = '') => {
    let templateUser = null;
    if (userId) {
      templateUser = MOCK_USERS.find((u) => u.id === userId);
    }
    if (!templateUser && email) {
      templateUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }
    if (!templateUser) {
      templateUser = MOCK_USERS.find((u) => u.rol.toLowerCase() === role.toLowerCase()) || MOCK_USERS[0];
    }

    const loggedUser = {
      ...templateUser,
      email: email || templateUser.email,
      nombre: nombre || templateUser.nombre,
      rol: templateUser.rol || role
    };
    setCurrentUser(loggedUser);
    return loggedUser;
  };

  const switchRole = (roleOrId) => {
    const targetUser =
      MOCK_USERS.find((u) => u.id === roleOrId) ||
      MOCK_USERS.find((u) => u.rol.toLowerCase() === roleOrId.toLowerCase());
    if (targetUser) {
      setCurrentUser(targetUser);
    } else {
      setCurrentUser((prev) => ({ ...prev, rol: roleOrId }));
    }
  };

  const hasPermission = (moduleName) => {
    if (!currentUser) return false;
    if (currentUser.rol === 'Administrador') return true;
    if (Array.isArray(currentUser.permisos)) {
      return currentUser.permisos.includes(moduleName);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        switchRole,
        hasPermission,
        logout,
        availableUsers: MOCK_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
