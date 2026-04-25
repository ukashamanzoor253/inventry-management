import { prisma } from "@/lib/prisma";

const defaultNavConfigs = [
  {
    route: "/",
    role: "USER" as const,
    navLinks: [
      { label: "Dashboard", href: "/", visible: true },
      { label: "Purchase Orders", href: "/orders", visible: true },
      { label: "Create Orders", href: "/createorder", visible: true },
    ],
    buttons: [
      { label: "Purchase Orders", href: "/orders", icon: "ShoppingCart", visible: true },
    ],
    showAddButton: false,
  },
  {
    route: "/inventory",
    role: "USER" as const,
    navLinks: [
      { label: "Inventory", href: "/inventory", visible: true },
      { label: "Products", href: "/products", visible: true },
      { label: "Categories", href: "/categories", visible: true },
    ],
    buttons: [],
    showAddButton: true,
  },
  // repeat for /orders, /createorder, /products, /categories, /revenue, /stock-alerts
];

async function main() {
  for (const config of defaultNavConfigs) {
    await prisma.navConfig.upsert({
      where: { route_role: { route: config.route, role: config.role } },
      update: config,
      create: config,
    });
  }
}

main().finally(() => prisma.$disconnect());