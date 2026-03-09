import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
