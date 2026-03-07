import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { useAppStore } from "./store/useAppStore";
import axios from "axios";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { setUser } = useAppStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // check auth
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser({ ...res.data, token });
      }).catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      }).finally(() => {
        setIsCheckingAuth(false);
      });
    } else {
      setIsCheckingAuth(false);
    }
  }, [setUser]);

  if (isCheckingAuth) {
    return null; // Return nothing while validating initial token
  }

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        {/* Other routes will be added here */}
      </Route>
    </Routes>
  );
};

export default App;