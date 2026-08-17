import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

export const themeInitScript = `(function(){try{if(localStorage.getItem('catalytic-theme')==='light'){document.documentElement.classList.remove('dark');}}catch(e){}})();`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("catalytic-theme") as Theme | null) ?? "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored !== "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("catalytic-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="h-8 w-8 rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}