
export enum View {
  Home = 'HOME',
  Order = 'ORDER',
  Checkout = 'CHECKOUT',
  Admin = 'ADMIN',
}

export enum AdminView {
  Dashboard = 'DASHBOARD',
  POS = 'POS',
  Tables = 'TABLES',
  Orders = 'ORDERS',
  KDS = 'KDS',
  Products = 'PRODUCTS',
  Customers = 'CUSTOMERS',
  Coupons = 'COUPONS',
  Reports = 'REPORTS',
  VeoAnimation = 'VEO_ANIMATION',
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pizza' | 'drink' | 'dessert';
  tags?: ('vegan' | 'gluten-free')[];
  preparationTime: number; // in minutes
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  isPromo?: boolean;
  customization?: {
    size: 'medium' | 'large';
    crust: 'classic' | 'thin' | 'cheese-filled';
    flavors: MenuItem[]; 
  };
}

export enum TableStatus {
  Available = 'AVAILABLE',
  Occupied = 'OCCUPIED',
  NeedsAttention = 'NEEDS_ATTENTION',
}

export interface Table {
  id: number;
  name: string;
  status: TableStatus;
  capacity: number;
  orderId?: number;
}

export enum OrderStatus {
  Pending = 'PENDING',
  Preparing = 'PREPARING',
  Ready = 'READY',
  Delivering = 'DELIVERING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export enum OrderType {
  DineIn = 'DINE_IN',
  Delivery = 'DELIVERY',
  Takeout = 'TAKEOUT',
}

export interface Order {
  id: number;
  type: OrderType;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  discount?: number;
  customerName: string;
  customerId?: number;
  address?: string;
  tableId?: number;
  createdAt: string;
  startedPreparingAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minValue?: number;
  description: string;
}