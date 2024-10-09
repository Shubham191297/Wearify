import React from "react";
import { useState } from "react";
import CustomError from "../layouts/CustomError";

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

export async function getCSRFToken() {
  const response = await fetch("http://localhost:5000/auth/csrfToken", {
    credentials: "include",
  });
  const tokenData = await response.json();
  if (!response.ok) {
    throw new CustomError(
      response.statusText,
      tokenData.message,
      response.status
    );
  }
  return tokenData.CSRFToken;
}
