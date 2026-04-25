import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavLink = { label: string; href: string; visible: boolean };
export type NavButton = { label: string; href: string; icon: string; visible: boolean };

export type NavConfig = {
  navLinks: NavLink[];
  buttons: NavButton[];
  showAddButton: boolean;
} | null;

const defaultConfig: NavConfig = {
  navLinks: [
    { label: "Dashboard", href: "/", visible: true },
    { label: "Purchase Orders", href: "/orders", visible: true },
    { label: "Create Orders", href: "/createorder", visible: true },
  ],
  buttons: [
    { label: "Purchase Orders", href: "/orders", icon: "ShoppingCart", visible: true },
  ],
  showAddButton: false,
};

export function useNavConfig() {
  const pathname = usePathname();
  const [config, setConfig] = useState<NavConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/nav-config?route=${pathname}`)
      .then((r) => r.json())
      .then((data) => setConfig(data || defaultConfig))
      .finally(() => setLoading(false));
  }, [pathname]);

  return { config, loading };
}