import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.tsx";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Dynamic Background Gradient */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(0,0,0,0))] pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
