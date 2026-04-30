import { User } from './types';

export const canManageProduct = (user: User, productSellerId: string): boolean => {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'SELLER' && user.isActive) return user.id === productSellerId;
  return false;
};

export const canViewProducts = (user: User, sellerId?: string): boolean => {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'SELLER' && user.isActive) {
    if (sellerId) return user.id === sellerId;
    return true;
  }
  return false;
};

export const canManageSeller = (user: User): boolean => {
  return user.role === 'ADMIN';
};

export const canAccessDashboard = (user: User): boolean => {
  return user.isActive && (user.role === 'ADMIN' || user.role === 'SELLER');
};