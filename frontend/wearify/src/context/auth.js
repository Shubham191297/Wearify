import React from "react";
import { useState } from "react";

const AuthContext = React.createContext({
  user: { isLoggedIn: Boolean, username: String, roleAdmin: Boolean },
  login: () => {},
  logout: () => {},
});

export const AuthProvider = (props) => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const [userData, setUserData] = useState(
    storedUser
      ? storedUser
      : {
          isLoggedIn: false,
          username: "",
          roleAdmin: false,
        }
  );

  const login = (username, isAdmin) => {
    setUserData(() => ({
      username: username,
      isLoggedIn: true,
      roleAdmin: isAdmin,
    }));
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    setUserData({
      username: "",
      isLoggedIn: false,
      roleAdmin: false,
    });
  };

  const userContextValue = {
    user: userData,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={userContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
