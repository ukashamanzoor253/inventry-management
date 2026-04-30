// lib/types.ts
export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: 'ADMIN' | 'SELLER' | 'USER';
  isActive: boolean;
  sellerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}