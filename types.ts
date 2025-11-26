
/**
 * Const object que define as diferentes telas/visualizações da aplicação
 */
export const View = {
  Home: 'HOME',           // Tela inicial com apresentação e promoções
  Order: 'ORDER',         // Tela do cardápio para fazer pedidos
  Checkout: 'CHECKOUT',   // Tela de finalização e pagamento do pedido
  Admin: 'ADMIN',         // Painel administrativo
} as const;

export type View = typeof View[keyof typeof View];

/**
 * Const object que define as diferentes seções do painel administrativo
 */
export const AdminView = {
  Dashboard: 'DASHBOARD',
  POS: 'POS',
  Tables: 'TABLES',
  Orders: 'ORDERS',
  KDS: 'KDS',
  Products: 'PRODUCTS',
  Customers: 'CUSTOMERS',
  Coupons: 'COUPONS',
  Reports: 'REPORTS',
} as const;

export type AdminView = typeof AdminView[keyof typeof AdminView];

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

/**
 * Const object que define os possíveis status de uma mesa
 */
export const TableStatus = {
  Available: 'AVAILABLE',
  Occupied: 'OCCUPIED',
  NeedsAttention: 'NEEDS_ATTENTION',
} as const;

export type TableStatus = typeof TableStatus[keyof typeof TableStatus];

export interface Table {
  id: number;
  name: string;
  status: TableStatus;
  capacity: number;
  orderId?: number;
}

/**
 * Const object que define os possíveis status de um pedido
 */
export const OrderStatus = {
  Pending: 'PENDING',
  Preparing: 'PREPARING',
  Ready: 'READY',
  Delivering: 'DELIVERING',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

/**
 * Const object que define os tipos de pedido
 */
export const OrderType = {
  DineIn: 'DINE_IN',
  Delivery: 'DELIVERY',
  Takeout: 'TAKEOUT',
} as const;

export type OrderType = typeof OrderType[keyof typeof OrderType];

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