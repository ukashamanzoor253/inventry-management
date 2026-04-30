// types/supplier.ts
export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface SupplierFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
  }