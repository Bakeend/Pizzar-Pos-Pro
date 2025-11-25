
import React, { useState } from 'react';
import { View, MenuItem, CartItem, Order, Table, OrderType, OrderStatus, TableStatus, Customer, Coupon } from './types';
import Header from './components/Header';
import HomeScreen from './components/screens/HomeScreen';
import MenuScreen from './components/screens/MenuScreen';
import CheckoutScreen from './components/screens/CheckoutScreen';
import AdminScreen from './components/screens/AdminScreen';
import PizzaModal from './components/PizzaModal';
import ComboModal from './components/ComboModal';
import CartSidebar from './components/CartSidebar';
import { menuItems as mockMenuItems, pizzas, orders as mockOrders, tables as mockTables, customers as mockCustomers, coupons as mockCoupons } from './data/mockData';

// Helper function to calculate price of a customized pizza item
const calculatePizzaPrice = (cartItem: CartItem): number => {
    // If it's a promo item (like a fixed price combo), return the base price immediately
    if (cartItem.isPromo) return cartItem.item.price;

    const { item, customization } = cartItem;
    if (!customization) return item.price; 
    
    let basePrice;
    if (customization.flavors.length > 1) {
        basePrice = Math.max(customization.flavors[0].price, customization.flavors[1].price);
    } else {
        basePrice = item.price;
    }
    
    let finalPrice = basePrice;
    if (customization.size === 'large') finalPrice += 10.00;
    if (customization.crust === 'cheese-filled') finalPrice += 8.00;
    
    return finalPrice;
};


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  
  // Lifted State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  
  // UI State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pizzaToCustomize, setPizzaToCustomize] = useState<MenuItem | null>(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // Animation trigger
  const triggerCartAnimation = () => {
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 300);
  };

  // Pizza customization modal handlers
  const handleOrderPizza = (pizza: MenuItem) => setPizzaToCustomize(pizza);
  const handleClosePizzaModal = () => setPizzaToCustomize(null);

  // Cart handlers
  const handleAddToCart = (item: CartItem) => {
    setCart(currentCart => [...currentCart, item]);
    handleClosePizzaModal();
    triggerCartAnimation();
  };
  
  const handleAddItem = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.item.id === item.id && !cartItem.customization && !cartItem.isPromo);
      if (existingItemIndex > -1) {
        const newCart = [...currentCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }
      return [...currentCart, { item, quantity: 1 }];
    });
    triggerCartAnimation();
  };

  // Combo Handler
  const handleAddCombo = (pizza1: MenuItem, pizza2: MenuItem, drink: MenuItem) => {
      // Logic: 2 Large Pizzas + 1 Drink = 89.90
      // We set specific prices for the items to sum up to 89.90 exactly.
      // Drink: 12.00
      // Remaining: 77.90 => 38.95 per pizza.
      // We use 'isPromo: true' to tell the price calculator NOT to add +10 for size 'large'.
      
      const comboDrinkPrice = 12.00;
      const pizzaPrice = 38.95; 

      const p1: CartItem = {
          item: { ...pizza1, price: pizzaPrice }, 
          quantity: 1,
          isPromo: true, // Prevents size surcharge
          customization: { size: 'large', crust: 'classic', flavors: [pizza1] }
      };
      
      const p2: CartItem = {
          item: { ...pizza2, price: pizzaPrice },
          quantity: 1,
          isPromo: true, // Prevents size surcharge
          customization: { size: 'large', crust: 'classic', flavors: [pizza2] }
      };

      const d1: CartItem = {
          item: { ...drink, price: comboDrinkPrice },
          quantity: 1,
          isPromo: true
      };

      setCart(current => [...current, p1, p2, d1]);
      setIsComboModalOpen(false);
      triggerCartAnimation();
      setIsCartOpen(true); // Open cart to show items
  };
  
  // Checkout and Order Placement
  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setView(View.Checkout);
  };
  
  const handlePlaceOrder = (details: { 
    orderType: OrderType; 
    customerName: string; 
    phone?: string;
    customerId?: number;
    address?: string; 
    tableId?: number, 
    discount?: number 
  }) => {
    const cartTotal = cart.reduce((sum, cartItem) => {
        const itemPrice = cartItem.item.category === 'pizza' 
            ? calculatePizzaPrice(cartItem) 
            : cartItem.item.price;
        return sum + itemPrice * cartItem.quantity;
    }, 0);
    
    // Free delivery for orders over R$ 80.00
    const deliveryFee = details.orderType === OrderType.Delivery 
        ? (cartTotal >= 80 ? 0 : 5.00) 
        : 0;

    const discount = details.discount || 0;
    const finalTotal = Math.max(0, cartTotal + deliveryFee - discount);
      
    // Try to link to existing customer if not provided but phone matches
    let finalCustomerId = details.customerId;
    if (!finalCustomerId && details.phone) {
        const existingCustomer = customers.find(c => c.phone === details.phone);
        if (existingCustomer) {
            finalCustomerId = existingCustomer.id;
        } else {
            // Ideally we would create a new customer here, but for this mock we'll just leave it loosely coupled
            // unless we want to auto-register. Let's auto-register for the "VIP System" to work next time.
            const newCustomer: Customer = {
                id: Date.now(),
                name: details.customerName,
                phone: details.phone,
                email: '',
                address: details.address
            };
            setCustomers(prev => [...prev, newCustomer]);
            finalCustomerId = newCustomer.id;
        }
    }

    const newOrder: Order = {
        id: Date.now(),
        type: details.orderType,
        status: OrderStatus.Pending,
        items: cart,
        total: finalTotal,
        discount: discount,
        customerName: details.customerName,
        customerId: finalCustomerId,
        address: details.address,
        tableId: details.tableId,
        createdAt: new Date().toISOString(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);

    if (details.tableId) {
        setTables(prevTables => 
            prevTables.map(table => 
                table.id === details.tableId 
                ? { ...table, status: TableStatus.Occupied, orderId: newOrder.id }
                : table
            )
        );
    }
    
    alert('Pedido realizado com sucesso! Acompanhe o status no painel do administrador.');
    setCart([]);
    setView(View.Home);
  };


  const renderContent = () => {
    switch (view) {
      case View.Home:
        return <HomeScreen setView={setView} onOpenCombo={() => setIsComboModalOpen(true)} />;
      case View.Order:
        return <MenuScreen menuItems={menuItems} onOrderPizza={handleOrderPizza} onAddItem={handleAddItem} />;
      case View.Checkout:
        return <CheckoutScreen 
                  cart={cart} 
                  tables={tables} 
                  coupons={coupons}
                  orders={orders}
                  customers={customers}
                  onPlaceOrder={handlePlaceOrder} 
                  setView={setView} 
                />;
      case View.Admin:
        return <AdminScreen 
                  menuItems={menuItems} setMenuItems={setMenuItems} 
                  orders={orders} setOrders={setOrders}
                  tables={tables} setTables={setTables}
                  customers={customers} setCustomers={setCustomers}
                  coupons={coupons} setCoupons={setCoupons}
                />;
      default:
        return <HomeScreen setView={setView} onOpenCombo={() => setIsComboModalOpen(true)} />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      {view !== View.Admin && (
        <Header 
            setView={setView} 
            cart={cart} 
            setIsCartOpen={setIsCartOpen} 
            isCartAnimating={isCartAnimating} 
        />
      )}
      {renderContent()}
      {pizzaToCustomize && (
        <PizzaModal 
          pizza={pizzaToCustomize} 
          allPizzas={pizzas}
          onClose={handleClosePizzaModal}
          onAddToCart={handleAddToCart}
        />
      )}
      {isComboModalOpen && (
          <ComboModal
            pizzas={menuItems.filter(i => i.category === 'pizza')}
            drinks={menuItems.filter(i => i.category === 'drink')}
            onClose={() => setIsComboModalOpen(false)}
            onAddCombo={handleAddCombo}
          />
      )}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
};

export default App;
