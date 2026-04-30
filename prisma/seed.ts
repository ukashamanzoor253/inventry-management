// import { PrismaClient } from "../app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import bcrypt from "bcryptjs";
// import "dotenv/config";

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
// const prisma = new PrismaClient({ adapter });

// const ROUTES = ["/", "/orders", "/createorder", "/inventory", "/products", "/categories", "/revenue", "/stock-alerts"];

// const navLinksByRoute: Record<string, Array<{ label: string; href: string; visible: boolean }>> = {
//   "/": [
//     { label: "Dashboard", href: "/", visible: true },
//     { label: "Purchase Orders", href: "/orders", visible: true },
//     { label: "Create Orders", href: "/createorder", visible: true },
//   ],
//   "/orders": [
//     { label: "Dashboard", href: "/", visible: true },
//     { label: "Purchase Orders", href: "/orders", visible: true },
//     { label: "Create Orders", href: "/createorder", visible: true },
//   ],
//   "/createorder": [
//     { label: "Dashboard", href: "/", visible: true },
//     { label: "Purchase Orders", href: "/orders", visible: true },
//     { label: "Create Orders", href: "/createorder", visible: true },
//   ],
//   "/inventory": [
//     { label: "Inventory", href: "/inventory", visible: true },
//     { label: "Products", href: "/products", visible: true },
//     { label: "Categories", href: "/categories", visible: true },
//   ],
//   "/products": [
//     { label: "Inventory", href: "/inventory", visible: true },
//     { label: "Products", href: "/products", visible: true },
//     { label: "Categories", href: "/categories", visible: true },
//   ],
//   "/categories": [
//     { label: "Inventory", href: "/inventory", visible: true },
//     { label: "Products", href: "/products", visible: true },
//     { label: "Categories", href: "/categories", visible: true },
//   ],
//   "/revenue": [
//     { label: "Dashboard", href: "/", visible: true },
//     { label: "Orders", href: "/orders", visible: true },
//     { label: "Create Order", href: "/createorder", visible: true },
//   ],
//   "/stock-alerts": [
//     { label: "Dashboard", href: "/", visible: true },
//     { label: "Orders", href: "/orders", visible: true },
//     { label: "Create Order", href: "/createorder", visible: true },
//   ],
// };

// const buttonsByRoute: Record<string, Array<{ label: string; href: string; icon: string; visible: boolean }>> = {
//   "/": [{ label: "Purchase Orders", href: "/orders", icon: "ShoppingCart", visible: true }],
//   "/orders": [{ label: "Purchase Orders", href: "/orders", icon: "ShoppingCart", visible: true }],
//   "/createorder": [{ label: "Purchase Orders", href: "/orders", icon: "ShoppingCart", visible: true }],
//   "/inventory": [],
//   "/products": [],
//   "/categories": [],
//   "/revenue": [{ label: "Export Report", href: "/revenue/export", icon: "Download", visible: true }],
//   "/stock-alerts": [{ label: "Mark All Read", href: "#", icon: "CheckCheck", visible: true }],
// };

// const showAddButtonByRoute: Record<string, boolean> = {
//   "/": false,
//   "/orders": false,
//   "/createorder": false,
//   "/inventory": true,
//   "/products": true,
//   "/categories": true,
//   "/revenue": false,
//   "/stock-alerts": false,
// };

// async function main() {
//   console.log("🌱 Seeding database...");

//   // ── Admin user ──────────────────────────────────────────────
//   const adminPassword = await bcrypt.hash("admin123", 12);
//   const admin = await prisma.user.upsert({
//     where: { email: "admin@ims.com" },
//     update: {},
//     create: {
//       name: "Super Admin",
//       email: "admin@ims.com",
//       password: adminPassword,
//       role: "ADMIN",
//     },
//   });
//   console.log("✅ Admin user:", admin.email);

//   // ── Regular user ────────────────────────────────────────────
//   const userPassword = await bcrypt.hash("user123", 12);
//   const user = await prisma.user.upsert({
//     where: { email: "user@ims.com" },
//     update: {},
//     create: {
//       name: "John Doe",
//       email: "user@ims.com",
//       password: userPassword,
//       role: "USER",
//     },
//   });
//   console.log("✅ Regular user:", user.email);

//   // ── Categories ──────────────────────────────────────────────
//   const categories = await Promise.all([
//     prisma.category.upsert({ where: { name: "Electronics" }, update: {}, create: { name: "Electronics", color: "#3B82F6" } }),
//     prisma.category.upsert({ where: { name: "Furniture" }, update: {}, create: { name: "Furniture", color: "#8B5CF6" } }),
//     prisma.category.upsert({ where: { name: "Clothing" }, update: {}, create: { name: "Clothing", color: "#EC4899" } }),
//     prisma.category.upsert({ where: { name: "Food & Beverage" }, update: {}, create: { name: "Food & Beverage", color: "#F59E0B" } }),
//     prisma.category.upsert({ where: { name: "Office Supplies" }, update: {}, create: { name: "Office Supplies", color: "#10B981" } }),
//   ]);
//   console.log("✅ Categories seeded:", categories.length);

//   // ── Suppliers ───────────────────────────────────────────────
//   const suppliers = await Promise.all([
//     prisma.supplier.upsert({
//       where: { id: "supplier-1" },
//       update: {},
//       create: { id: "supplier-1", name: "TechCorp Ltd", email: "orders@techcorp.com", phone: "+1-555-0101", address: "123 Tech Street, Silicon Valley, CA" },
//     }),
//     prisma.supplier.upsert({
//       where: { id: "supplier-2" },
//       update: {},
//       create: { id: "supplier-2", name: "Global Supplies Inc", email: "supply@global.com", phone: "+1-555-0102", address: "456 Commerce Ave, New York, NY" },
//     }),
//     prisma.supplier.upsert({
//       where: { id: "supplier-3" },
//       update: {},
//       create: { id: "supplier-3", name: "FastShip Co", email: "info@fastship.com", phone: "+1-555-0103", address: "789 Logistics Blvd, Chicago, IL" },
//     }),
//   ]);
//   console.log("✅ Suppliers seeded:", suppliers.length);

//   // ── Products ────────────────────────────────────────────────
//   const products = await Promise.all([
//     prisma.product.upsert({
//       where: { sku: "ELEC-001" },
//       update: {},
//       create: { name: "Laptop Pro 15", sku: "ELEC-001", categoryId: categories[0].id, available: 45, reorderPoint: 10, price: 1299.99, location: "Shelf A1", images: [] },
//     }),
//     prisma.product.upsert({
//       where: { sku: "ELEC-002" },
//       update: {},
//       create: { name: "Wireless Mouse", sku: "ELEC-002", categoryId: categories[0].id, available: 5, reorderPoint: 20, price: 29.99, location: "Shelf A2", images: [] },
//     }),
//     prisma.product.upsert({
//       where: { sku: "ELEC-003" },
//       update: {},
//       create: { name: "USB-C Hub", sku: "ELEC-003", categoryId: categories[0].id, available: 0, reorderPoint: 15, price: 49.99, location: "Shelf A3", images: [] },
//     }),
//     prisma.product.upsert({
//       where: { sku: "FURN-001" },
//       update: {},
//       create: { name: "Ergonomic Chair", sku: "FURN-001", categoryId: categories[1].id, available: 12, reorderPoint: 5, price: 399.99, location: "Shelf B1", images: [] },
//     }),
//     prisma.product.upsert({
//       where: { sku: "CLTH-001" },
//       update: {},
//       create: { name: "Cotton T-Shirt (M)", sku: "CLTH-001", categoryId: categories[2].id, available: 200, reorderPoint: 50, price: 19.99, location: "Shelf C1", images: [] },
//     }),
//   ]);
//   console.log("✅ Products seeded:", products.length);

//   // ── Stock Alerts for low/critical products ──────────────────
//   await prisma.stockAlert.createMany({
//     skipDuplicates: true,
//     data: [
//       { productId: products[1].id, type: "LOW_STOCK", message: "Wireless Mouse is below reorder point (5 left)" },
//       { productId: products[2].id, type: "CRITICAL", message: "USB-C Hub is out of stock" },
//     ],
//   });
//   console.log("✅ Stock alerts seeded");

//   // ── Nav Config for USER role ────────────────────────────────
//   for (const route of ROUTES) {
//     await prisma.navConfig.upsert({
//       where: { route_role: { route, role: "USER" } },
//       update: {},
//       create: {
//         route,
//         role: "USER",
//         navLinks: navLinksByRoute[route] ?? [],
//         buttons: buttonsByRoute[route] ?? [],
//         showAddButton: showAddButtonByRoute[route] ?? false,
//       },
//     });
//   }

//   // ── Nav Config for ADMIN role (admins see everything) ───────
//   for (const route of ROUTES) {
//     await prisma.navConfig.upsert({
//       where: { route_role: { route, role: "ADMIN" } },
//       update: {},
//       create: {
//         route,
//         role: "ADMIN",
//         navLinks: navLinksByRoute[route] ?? [],
//         buttons: buttonsByRoute[route] ?? [],
//         showAddButton: showAddButtonByRoute[route] ?? false,
//       },
//     });
//   }
//   console.log("✅ Nav configs seeded for all routes × roles");

//   // ── Sample Order ────────────────────────────────────────────
//   await prisma.order.upsert({
//     where: { orderNumber: "ORD-000001" },
//     update: {},
//     create: {
//       orderNumber: "ORD-000001",
//       type: "online",
//       supplierId: suppliers[0].id,
//       expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       priority: "HIGH",
//       notes: "Urgent restock order",
//       status: "PENDING",
//       userId: admin.id,
//       items: {
//         create: [
//           { productId: products[0].id, quantity: 10, price: products[0].price },
//           { productId: products[1].id, quantity: 50, price: products[1].price },
//         ],
//       },
//     },
//   });
//   console.log("✅ Sample order seeded");

//   console.log("\n🎉 Seed complete!");
//   console.log("   Admin → admin@ims.com / admin123");
//   console.log("   User  → user@ims.com  / user123");
// }

// main()
//   .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
//   .finally(() => prisma.$disconnect());