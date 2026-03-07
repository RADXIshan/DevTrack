import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import AppLayout from "./components/layout/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import { useAppStore } from "./store/useAppStore";
import axios from "axios";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { setUser, theme } = useAppStore();

  useEffect(() => {
    // initialize theme
    document.documentElement.classList.toggle("dark", theme === "dark");
    
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
      });
    }
  }, [theme, setUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Other routes will be added here */}
      </Route>
    </Routes>
  );
};

export default App;