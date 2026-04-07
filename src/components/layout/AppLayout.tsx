import { NavLink, Outlet } from "react-router-dom";
import { Film } from "lucide-react";
import clipzyLogo from "@/assets/clipzyLogo.png";
import AuthDialog from "@/components/AuthDialog";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { to: "/", label: "Creator", icon: Film },
];

const AppLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 border-r border-border bg-muted/40 flex-col flex-shrink-0">
        <div className="h-20 px-4 border-b border-border flex items-center">
          <img src={clipzyLogo} alt="Clipzy logo" className="h-16 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-3 space-y-3">
          <AuthDialog />
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;

