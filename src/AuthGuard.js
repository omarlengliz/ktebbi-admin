// src/AuthGuard.js
import React from "react";
import { json, Navigate } from "react-router-dom";
import { useAuth } from "./Contexts/AuthContext";
import AdminNavbar from "./Component/AdminNav";
import Navbar from "./Component/AuthorNav";

const AuthGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user") ? true : false;
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const user = isAuthenticated ? JSON.parse(localStorage.getItem("user")) : null;
  const location = window.location;
  const noNavbarRoutes = ["/", "/register", "/otp"];

  const showNavbar = user && !noNavbarRoutes.includes(location.pathname);

 
  return (
    <>
      {" "}
      {showNavbar &&
        (user.role === "admin" ? (
          <Navbar userRole={"admin"} />
        ) : (
          <Navbar userRole={"author"} />
        ))}{" "}
      {children}
    </>
  );
};

export default AuthGuard;
